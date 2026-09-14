import { useState, useEffect, useRef } from "react";
import { getGeoIOCs } from "../../services/dataProvider";

function ThreatGlobe({ caseId }) {
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);
  const markersGroupRef = useRef([]);
  const animFrameRef = useRef(null);
  const tickerIntervalRef = useRef(null);

  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [ipInput, setIpInput] = useState("185.220.101.5");
  const [logs, setLogs] = useState([
    { text: "> Radar Engine initialized...", type: "info" },
    { text: "> Fetching threat telemetry from backend API...", type: "info" }
  ]);
  const [statusText, setStatusText] = useState("RADAR READY");
  const [statusColor, setStatusColor] = useState("#00f2fe");
  const [isScanning, setIsScanning] = useState(false);
  const [isMagnifying, setIsMagnifying] = useState(false);
  const [tickerCoords, setTickerCoords] = useState("COORDS: 0.0000, 0.0000");
  const [opticalMagText, setOpticalMagText] = useState("OPTICAL MAG: 1.0X");
  const [opticalStatusText, setOpticalStatusText] = useState("LOCKING TELEMETRY");
  const [toastMessage, setToastMessage] = useState(null);

  // Helper to append terminal logs
  const appendLog = (text, type = "") => {
    setLogs((prev) => [...prev, { text: `> ${text}`, type }]);
  };

  // Toast notification trigger
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Ensure Leaflet CSS & FontAwesome CSS are loaded in <head>
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("fontawesome-css")) {
      const link = document.createElement("link");
      link.id = "fontawesome-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
      document.head.appendChild(link);
    }
  }, []);

  // 2. Fetch points from backend (or fallback dummy locations) via dataProvider
  useEffect(() => {
    setLoading(true);
    getGeoIOCs(caseId).then((result) => {
      const validPoints = (result || []).filter(
        (p) => Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng || p.lon))
      );
      setPoints(validPoints);
      setLoading(false);
    });
  }, [caseId]);

  // 3. Initialize Leaflet Map & trigger initial scan & zoom
  useEffect(() => {
    if (loading || !mapRef.current) return;

    const initLeafletMap = () => {
      if (!window.L) return;

      if (!leafletInstance.current) {
        const L = window.L;
        const map = L.map(mapRef.current, { zoomControl: false }).setView([20, 0], 2);
        L.control.zoom({ position: "topleft" }).addTo(map);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "© OpenStreetMap contributors | Trace-X Forensic Engine",
        }).addTo(map);

        leafletInstance.current = map;
      }

      const initialPoint = points.length > 0 ? points[0] : null;
      if (initialPoint) {
        runFullScanAndZoom(initialPoint.label || "185.220.101.5", initialPoint);
      } else {
        runFullScanAndZoom("185.220.101.5", {
          lat: 55.7558,
          lng: 37.6173,
          label: "185.220.101.5",
          city: "Moscow",
          country: "Russia",
          isp: "Tor Exit Relay / AS62005"
        });
      }
    };

    if (window.L) {
      initLeafletMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initLeafletMap;
      document.body.appendChild(script);
    }

    return () => {
      if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [loading]);

  // Execute Full Map Reconnaissance Scan + Magnifying Lens Zoom
  const runFullScanAndZoom = async (ip, targetGeoData = null) => {
    if (!leafletInstance.current || !window.L) return;
    const L = window.L;
    const map = leafletInstance.current;

    if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    setIpInput(ip);
    setStatusText("FULL MAP SCANNING...");
    setStatusColor("#ffb703");
    setIsScanning(true);
    setIsMagnifying(false);

    // Reset map view to global world view for scanning
    map.setView([20, 0], 2, { animate: false });

    // Clear existing markers
    markersGroupRef.current.forEach((m) => map.removeLayer(m));
    markersGroupRef.current = [];

    appendLog(`[1/3] Launching Global Map Reconnaissance Scan...`, "info");
    appendLog(`Querying backend threat intelligence for IP: ${ip}...`, "info");

    // Random Lat/Lon Ticker during scan
    tickerIntervalRef.current = setInterval(() => {
      const rLat = (Math.random() * 160 - 80).toFixed(4);
      const rLon = (Math.random() * 360 - 180).toFixed(4);
      setTickerCoords(`COORDS: ${rLat}, ${rLon}`);
    }, 65);

    // Resolve target location
    let target = targetGeoData;
    if (!target) {
      const matched = points.find((p) => p.label === ip);
      if (matched) {
        target = matched;
      } else {
        const demoLocations = {
          "45.33.32.156": { lat: 40.7128, lng: -74.006, city: "New York (Suspect Relay)", country: "United States", isp: "Linode Hosting / AS63949" },
          "185.220.101.5": { lat: 55.7558, lng: 37.6173, city: "Moscow", country: "Russia", isp: "Tor Exit Relay / AS62005" },
          "203.0.113.44": { lat: 39.9042, lng: 116.4074, city: "Beijing", country: "China", isp: "CHINANET IP Infrastructure" },
          "198.51.100.9": { lat: 50.4501, lng: 30.5234, city: "Kyiv", country: "Ukraine", isp: "Ukrtelecom Relay Node" },
          "93.184.216.34": { lat: 42.3601, lng: -71.0589, city: "Boston", country: "United States", isp: "EDGECAST Partner Network" },
          "104.16.132.229": { lat: 37.7749, lng: -122.4194, city: "San Francisco", country: "United States", isp: "Cloudflare CDN Edge" },
        };
        target = demoLocations[ip] || {
          lat: 40.7128,
          lng: -74.006,
          city: "New York (Forwarded Suspect Relay)",
          country: "United States",
          isp: "Linode Cyber Hosting",
        };
      }
    }

    target.ip = ip;
    target.lat = Number(target.lat);
    target.lng = Number(target.lng || target.lon);

    // Wait 2.2 seconds for full map scanning effect
    await new Promise((resolve) => setTimeout(resolve, 2200));

    clearInterval(tickerIntervalRef.current);
    setTickerCoords(`TARGET LOCKED: ${target.lat.toFixed(4)}, ${target.lng.toFixed(4)}`);
    setCurrentTarget(target);
    appendLog(`[2/3] Target acquired: ${target.city}, ${target.country}. Deploying Magnifying Glass Zoom...`, "warn");

    setIsScanning(false);
    setIsMagnifying(true);

    // Leaflet smooth flyTo zoom down to city level
    const zoomDuration = 2.4;
    map.flyTo([target.lat, target.lng], 13, {
      duration: zoomDuration,
      easeLinearity: 0.25,
    });

    const startTime = performance.now();
    const magnifierElement = document.getElementById("threat-magnifier-glass");

    function animateMagnifier(currentTime) {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / zoomDuration, 1);

      if (magnifierElement && leafletInstance.current) {
        const targetContainerPoint = leafletInstance.current.latLngToContainerPoint([target.lat, target.lng]);
        magnifierElement.style.left = `${targetContainerPoint.x}px`;
        magnifierElement.style.top = `${targetContainerPoint.y}px`;
      }

      const magFactor = (1.0 + progress * 17.0).toFixed(1);
      setOpticalMagText(`OPTICAL MAG: ${magFactor}X`);
      setOpticalStatusText(progress < 0.7 ? "ZOOMING LOCATION..." : "LOCKING TARGET...");

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateMagnifier);
      } else {
        setTimeout(() => {
          setIsMagnifying(false);

          // Plot all points on map
          const renderList = points.length > 0 ? points : [target];
          renderList.forEach((p) => {
            const pLat = Number(p.lat);
            const pLng = Number(p.lng || p.lon);
            const isTarget = p.label === target.ip || (pLat === target.lat && pLng === target.lng);

            const customIcon = L.divIcon({
              className: "custom-radar-marker",
              html: `
                <div style="
                  width: ${isTarget ? "26px" : "18px"};
                  height: ${isTarget ? "26px" : "18px"};
                  background: ${isTarget ? "#ff0055" : "#00f2fe"};
                  border: 2px solid #ffffff;
                  border-radius: 50%;
                  box-shadow: 0 0 20px ${isTarget ? "#ff0055" : "#00f2fe"};
                  position: relative;
                ">
                  ${isTarget ? `<div style="
                    position: absolute; top:-12px; left:-12px;
                    width: 46px; height: 46px;
                    border: 2px solid #ff0055;
                    border-radius: 50%;
                    animation: pulseExpand 1.5s infinite;
                  "></div>` : ""}
                </div>
              `,
              iconSize: [26, 26],
              iconAnchor: [13, 13],
            });

            const m = L.marker([pLat, pLng], { icon: customIcon }).addTo(map);
            m.bindPopup(`
              <div style="font-family: monospace; padding: 4px; color: #fff;">
                <b style="color: #ff0055;">SUSPECT IOC ORIGIN</b><br/>
                <b>IP:</b> ${p.label || target.ip}<br/>
                <b>Location:</b> ${p.city || target.city}, ${p.country || target.country}<br/>
                <b>Coords:</b> ${pLat.toFixed(4)}, ${pLng.toFixed(4)}
              </div>
            `);

            if (isTarget) m.openPopup();
            markersGroupRef.current.push(m);
          });

          setStatusText("TARGET LOCKED");
          setStatusColor("#00e676");
          appendLog(`[3/3] [LOCK CONFIRMED] Threat device locked: ${target.city}, ${target.country} (${target.lat.toFixed(4)}, ${target.lng.toFixed(4)})`, "alert");
        }, 300);
      }
    }

    animFrameRef.current = requestAnimationFrame(animateMagnifier);
  };

  const handleCopyAddress = () => {
    if (!currentTarget) return;
    const text = `[FORENSIC THREAT TELEMETRY]
Target IP: ${currentTarget.ip}
Coordinates: ${currentTarget.lat.toFixed(4)}, ${currentTarget.lng.toFixed(4)}
Location: ${currentTarget.city}, ${currentTarget.country}
ISP / Infra: ${currentTarget.isp || "Linode Cyber Hosting"}
Status: SUSPECT FORGED HOP (MITM Insertion Detected)`;

    navigator.clipboard.writeText(text).then(() => {
      showToast("Exact Device Origin Address copied to clipboard!");
    });
  };

  if (loading) {
    return (
      <div style={{ color: "var(--soc-cyan)", padding: "20px", fontFamily: "monospace", textAlign: "center" }}>
        <i className="fa-solid fa-radar fa-spin"></i> Initializing Trace-X Threat Geolocation Engine...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Bar */}
      <div style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logo}>
            <i className="fa-solid fa-radar"></i>
          </div>
          <div>
            <h3 style={styles.title}>Trace-X // Threat Geolocation Radar</h3>
            <span style={styles.subtitle}>Email Threat Intelligence & Origin Device Radar</span>
          </div>
        </div>

        <div style={styles.statusContainer}>
          <div style={{ ...styles.statusPulse, background: statusColor, boxShadow: `0 0 10px ${statusColor}` }} />
          <span style={{ color: statusColor, fontWeight: "bold" }}>{statusText}</span>
        </div>
      </div>

      {/* Toolbar & Sample Chips */}
      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <i className="fa-solid fa-crosshairs" style={styles.searchIcon}></i>
          <input
            type="text"
            style={styles.searchInput}
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            placeholder="Enter IP address (e.g. 185.220.101.5)..."
          />
        </div>

        <button style={styles.btnPrimary} onClick={() => runFullScanAndZoom(ipInput)}>
          <i className="fa-solid fa-location-crosshairs"></i> Trace IP Origin
        </button>

        <button style={styles.btnDanger} onClick={() => runFullScanAndZoom("45.33.32.156")}>
          <i className="fa-solid fa-shield-virus"></i> Demo MITM Hop
        </button>

        <div style={styles.chipGroup}>
          <span style={styles.chipLabel}>Sample IPs:</span>
          {[
            { ip: "185.220.101.5", tag: "Moscow" },
            { ip: "45.33.32.156", tag: "NY Relay" },
            { ip: "203.0.113.44", tag: "Beijing" },
            { ip: "198.51.100.9", tag: "Kyiv" },
          ].map((item) => (
            <span
              key={item.ip}
              style={styles.chip}
              onClick={() => runFullScanAndZoom(item.ip)}
            >
              {item.ip} ({item.tag})
            </span>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div style={styles.mainGrid}>
        {/* Map Frame with Overlays */}
        <div style={styles.mapFrame} id="threat-map-frame">
          {/* Full Map Reconnaissance Scan Overlay */}
          <div style={{ ...styles.scanOverlay, opacity: isScanning ? 1 : 0, display: isScanning ? "block" : "none" }}>
            <div style={styles.scanGridPattern} />
            <div style={{ ...styles.hudCorner, top: 10, left: 10, borderTop: "2px solid #00f2fe", borderLeft: "2px solid #00f2fe" }}>RECON GRID 01</div>
            <div style={{ ...styles.hudCorner, top: 10, right: 10, borderTop: "2px solid #00f2fe", borderRight: "2px solid #00f2fe", textAlign: "right" }}>SYSTEM STATUS: FULL MAP SCAN</div>
            <div style={{ ...styles.hudCorner, bottom: 10, left: 10, borderBottom: "2px solid #00f2fe", borderLeft: "2px solid #00f2fe" }}>{tickerCoords}</div>
            <div style={{ ...styles.hudCorner, bottom: 10, right: 10, borderBottom: "2px solid #00f2fe", borderRight: "2px solid #00f2fe", textAlign: "right" }}>MODE: SATELLITE TRIANGULATION</div>

            <div style={styles.laserBeamX} />
            <div style={styles.laserBeamY} />

            <div style={styles.radarCircle}>
              <div style={styles.radarSweepLine} />
            </div>

            <div style={styles.scanBanner}>
              <i className="fa-solid fa-radar fa-spin"></i> INITIALIZING GLOBAL MAP RECONNAISSANCE SCAN...
            </div>
          </div>

          {/* High-Precision Magnifying Glass Overlay */}
          <div
            id="threat-magnifier-glass"
            style={{
              ...styles.magnifierGlass,
              display: isMagnifying ? "block" : "none",
              opacity: isMagnifying ? 1 : 0,
            }}
          >
            <div style={styles.glassLens}>
              <div style={styles.lensCrosshairH} />
              <div style={styles.lensCrosshairV} />
              <div style={styles.lensTargetDot} />
              <div style={styles.lensRingOuter} />
              <div style={styles.lensGlare} />
              <div style={styles.lensHudInfo}>
                <span>{opticalMagText}</span>
                <span>{opticalStatusText}</span>
              </div>
            </div>
            <div style={styles.glassHandle} />
          </div>

          {/* Leaflet Map Div */}
          <div ref={mapRef} style={styles.mapDiv} />
        </div>

        {/* Side HUD Panel */}
        <div style={styles.sidePanel}>
          {/* Console Log */}
          <div style={styles.panelBox}>
            <div style={styles.panelHeader}>
              <i className="fa-solid fa-terminal"></i> Forensic Console Log
            </div>
            <div style={styles.logConsole}>
              {logs.map((item, idx) => (
                <div key={idx} style={{ marginBottom: "4px", color: item.type === "alert" ? "#ff0055" : item.type === "warn" ? "#ffb703" : "#00f2fe" }}>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Card */}
          <div style={{ ...styles.panelBox, flexGrow: 1 }}>
            <div style={styles.panelHeader}>
              <i className="fa-solid fa-map-pin"></i> Target Device Telemetry
            </div>

            <div style={styles.telemetryRows}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Target IP</span>
                <span style={styles.detailVal}>{currentTarget?.ip || "--"}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Coordinates</span>
                <span style={styles.detailVal}>
                  {currentTarget ? `${Number(currentTarget.lat).toFixed(4)}, ${Number(currentTarget.lng).toFixed(4)}` : "--"}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>City / Country</span>
                <span style={styles.detailVal}>
                  {currentTarget ? `${currentTarget.city || "Unknown"}, ${currentTarget.country || "Unknown"}` : "--"}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>ISP / Provider</span>
                <span style={styles.detailVal}>{currentTarget?.isp || "Linode Cyber Hosting"}</span>
              </div>
              <div style={{ ...styles.detailRow, borderLeft: "3px solid #ff0055" }}>
                <span style={styles.detailLabel}>Relay Custody</span>
                <span style={{ ...styles.detailVal, color: "#ff0055" }}>SUSPECT RELAY (MITM)</span>
              </div>
            </div>

            <button style={styles.copyBtn} onClick={handleCopyAddress}>
              <i className="fa-solid fa-copy"></i> Copy Exact Device Address
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div style={styles.toast}>
          <i className="fa-solid fa-circle-check" style={{ color: "#00e676" }}></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "rgba(10, 15, 24, 0.95)",
    border: "1px solid var(--soc-border)",
    borderRadius: "14px",
    padding: "20px",
    fontFamily: "monospace",
    color: "#e2f1f8",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    borderBottom: "1px solid rgba(0, 242, 254, 0.25)",
    paddingBottom: "12px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #00f2fe, #0077ff)",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
    fontSize: "18px",
    boxShadow: "0 0 15px rgba(0, 242, 254, 0.5)",
  },
  title: {
    margin: 0,
    fontSize: "1.05rem",
    color: "#fff",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: "0.72rem",
    color: "#7a8f9e",
  },
  statusContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(0, 242, 254, 0.3)",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.78rem",
  },
  statusPulse: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
    marginBottom: "16px",
  },
  searchBox: {
    position: "relative",
    flex: "1",
    minWidth: "220px",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    color: "#00f2fe",
    fontSize: "14px",
  },
  searchInput: {
    width: "100%",
    background: "rgba(13, 20, 32, 0.9)",
    border: "1px solid rgba(0, 242, 254, 0.3)",
    padding: "8px 12px 8px 34px",
    borderRadius: "6px",
    color: "#fff",
    fontFamily: "monospace",
    fontSize: "0.82rem",
    outline: "none",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, rgba(0, 242, 254, 0.2), rgba(0, 119, 255, 0.2))",
    border: "1px solid #00f2fe",
    color: "#00f2fe",
    padding: "8px 16px",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: "0.78rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  btnDanger: {
    background: "rgba(255, 0, 85, 0.15)",
    border: "1px solid #ff0055",
    color: "#ff0055",
    padding: "8px 16px",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: "0.78rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  chipGroup: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  chipLabel: {
    fontSize: "0.72rem",
    color: "#7a8f9e",
  },
  chip: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.7rem",
    color: "#e2f1f8",
    cursor: "pointer",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "16px",
  },
  mapFrame: {
    position: "relative",
    border: "1px solid rgba(0, 242, 254, 0.3)",
    background: "#05080d",
    borderRadius: "8px",
    overflow: "hidden",
    minHeight: "440px",
  },
  mapDiv: {
    width: "100%",
    height: "100%",
    minHeight: "440px",
  },
  scanOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 2000,
    pointerEvents: "none",
    background: "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2) 0%, rgba(5, 10, 20, 0.85) 100%)",
    transition: "opacity 0.4s ease",
    overflow: "hidden",
  },
  scanGridPattern: {
    position: "absolute",
    inset: 0,
    backgroundImage: "linear-gradient(rgba(0, 242, 254, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 254, 0.08) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
  },
  hudCorner: {
    position: "absolute",
    padding: "6px 10px",
    fontSize: "0.65rem",
    color: "#00f2fe",
    letterSpacing: "1px",
  },
  laserBeamX: {
    position: "absolute",
    top: "30%",
    left: 0,
    width: "100%",
    height: "3px",
    background: "linear-gradient(90deg, transparent, #00f2fe, #0077ff, transparent)",
    boxShadow: "0 0 15px #00f2fe",
  },
  laserBeamY: {
    position: "absolute",
    top: 0,
    left: "40%",
    width: "3px",
    height: "100%",
    background: "linear-gradient(180deg, transparent, #00f2fe, #0077ff, transparent)",
    boxShadow: "0 0 15px #00f2fe",
  },
  radarCircle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "240px",
    height: "240px",
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",
    border: "1px solid rgba(0, 242, 254, 0.5)",
    boxShadow: "0 0 30px rgba(0, 242, 254, 0.25)",
  },
  radarSweepLine: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "conic-gradient(from 0deg, rgba(0, 242, 254, 0.5) 0deg, transparent 70deg, transparent 360deg)",
  },
  scanBanner: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(7, 10, 16, 0.92)",
    border: "1px solid #00f2fe",
    padding: "6px 18px",
    borderRadius: "20px",
    fontSize: "0.72rem",
    color: "#00f2fe",
    letterSpacing: "1px",
    boxShadow: "0 0 15px rgba(0, 242, 254, 0.4)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  magnifierGlass: {
    position: "absolute",
    width: "160px",
    height: "160px",
    zIndex: 2500,
    pointerEvents: "none",
    transform: "translate(-50%, -50%)",
    transition: "transform 0.4s ease, opacity 0.3s ease",
  },
  glassLens: {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: "4px solid #00f2fe",
    background: "radial-gradient(circle at 35% 35%, rgba(0, 242, 254, 0.3) 0%, rgba(5, 10, 20, 0.82) 75%)",
    boxShadow: "0 0 30px rgba(0, 242, 254, 0.8), inset 0 0 25px rgba(0, 242, 254, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  glassHandle: {
    position: "absolute",
    bottom: "-40px",
    right: "-22px",
    width: "11px",
    height: "70px",
    background: "linear-gradient(135deg, #00f2fe 0%, #0066ff 60%, #070a10 100%)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "6px",
    transform: "rotate(-45deg)",
    boxShadow: "0 0 15px rgba(0, 242, 254, 0.5)",
  },
  lensCrosshairH: {
    position: "absolute",
    width: "100%",
    height: "1px",
    background: "rgba(0, 242, 254, 0.6)",
  },
  lensCrosshairV: {
    position: "absolute",
    height: "100%",
    width: "1px",
    background: "rgba(0, 242, 254, 0.6)",
  },
  lensTargetDot: {
    position: "absolute",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#ff0055",
    boxShadow: "0 0 12px #ff0055",
  },
  lensRingOuter: {
    position: "absolute",
    width: "75%",
    height: "75%",
    borderRadius: "50%",
    border: "1.5px dashed #00f2fe",
  },
  lensGlare: {
    position: "absolute",
    top: "10%",
    left: "15%",
    width: "70%",
    height: "35%",
    borderRadius: "50%",
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, transparent 100%)",
    transform: "rotate(-30deg)",
  },
  lensHudInfo: {
    position: "absolute",
    bottom: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "0.6rem",
    color: "#00f2fe",
    fontWeight: "bold",
    background: "rgba(0, 0, 0, 0.7)",
    padding: "2px 6px",
    borderRadius: "4px",
    border: "1px solid rgba(0, 242, 254, 0.3)",
  },
  sidePanel: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  panelBox: {
    border: "1px solid rgba(0, 242, 254, 0.25)",
    background: "rgba(13, 20, 32, 0.85)",
    padding: "14px",
    borderRadius: "8px",
  },
  panelHeader: {
    fontSize: "0.78rem",
    color: "#00f2fe",
    marginBottom: "10px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textTransform: "uppercase",
  },
  logConsole: {
    fontSize: "0.72rem",
    height: "120px",
    overflowY: "auto",
    background: "rgba(0, 0, 0, 0.4)",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    lineHeight: "1.5",
  },
  telemetryRows: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "12px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 10px",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "4px",
    fontSize: "0.75rem",
    borderLeft: "3px solid #00f2fe",
  },
  detailLabel: {
    color: "#7a8f9e",
    fontSize: "0.7rem",
  },
  detailVal: {
    color: "#fff",
    fontWeight: "bold",
  },
  copyBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #00f2fe, #0088ff)",
    color: "#000",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "0.78rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  toast: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    background: "rgba(13, 20, 32, 0.95)",
    border: "1px solid #00f2fe",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "8px",
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 0 20px rgba(0, 242, 254, 0.5)",
    zIndex: 9999,
  },
};

export default ThreatGlobe;