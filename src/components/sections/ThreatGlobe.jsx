  import { useState, useEffect, useRef } from "react";
  import Globe from "react-globe.gl";
  import { getGeoIOCs } from "../../services/dataProvider";

  function ThreatGlobe({ caseId }) {
    const globeRef = useRef();

    const [points, setPoints] = useState(null);
    const [selectedPoint, setSelectedPoint] = useState(null);

    /* =========================
       LOAD GEO POINTS
    ========================== */

    useEffect(() => {
      setSelectedPoint(null);

      getGeoIOCs(caseId).then((result) => {
        const validPoints = (result || []).filter(
          (point) =>
            Number.isFinite(Number(point.lat)) &&
            Number.isFinite(Number(point.lng))
        );

        setPoints(validPoints);
      });
    }, [caseId]);

    /* =========================
       AUTO ROTATE INITIALLY
    ========================== */

    useEffect(() => {
      if (globeRef.current && points) {
        globeRef.current.pointOfView({ lat: 20, lng: 20, altitude: 2 }, 0);

        const controls = globeRef.current.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.2;

        const timer = setTimeout(() => {
          controls.autoRotate = false;
        }, 3000);

        return () => clearTimeout(timer);
      }
    }, [points]);

    /* =========================
       POINT CLICK
    ========================== */

    const handlePointClick = (point) => {
      setSelectedPoint(point);
    };

    /* =========================
       LOADING
    ========================== */

    if (!points) {
      return <p>Loading threat map...</p>;
    }

    return (
      <div style={styles.card}>
        <p style={styles.title}>THREAT MAP</p>

        <p style={styles.hint}>
          Drag to rotate • Hover for quick details • Click a point for full
          details
        </p>

        <div style={styles.mapArea}>
          <div style={styles.globeWrap}>
            <Globe
              ref={globeRef}
              width={500}
              height={420}
              backgroundColor="rgba(0,0,0,0)"
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
              pointsData={points}
              pointLat={(d) => Number(d.lat)}
              pointLng={(d) => Number(d.lng)}
              pointColor={() => "#ff3b3b"}
              pointRadius={0.9}
              pointAltitude={0.02}
              pointResolution={20}
              pointLabel={(d) => `
                <div style="
                  background:#0d1728;
                  border:1px solid #27d8f2;
                  padding:8px 12px;
                  border-radius:6px;
                  color:#fff;
                  font-family:monospace;
                  font-size:12px;
                  line-height:1.5;
                  box-shadow:0 0 12px rgba(39,216,242,0.25);
                ">
                  <b style="color:#ff3b3b;">
                    ${d.city || "Unknown"}, ${d.country || "Unknown"}
                  </b>
                  <br/>
                  IP: ${d.label || "Unknown"}
                </div>
              `}
              onPointClick={handlePointClick}
            />
          </div>

          {selectedPoint && (
            <div style={styles.locationCard}>
              <div style={styles.locationHeader}>
                <span>📍 LOCATION DETAILS</span>
                <button
                  style={styles.closeButton}
                  onClick={() => setSelectedPoint(null)}
                >
                  ×
                </button>
              </div>

              <div style={styles.locationContent}>
                <div style={styles.locationRow}>
                  <span style={styles.label}>IP Address</span>
                  <span style={styles.value}>
                    {selectedPoint.label || "Unknown"}
                  </span>
                </div>

                <div style={styles.locationRow}>
                  <span style={styles.label}>City</span>
                  <span style={styles.value}>
                    {selectedPoint.city || "Unknown"}
                  </span>
                </div>

                <div style={styles.locationRow}>
                  <span style={styles.label}>Country</span>
                  <span style={styles.value}>
                    {selectedPoint.country || "Unknown"}
                  </span>
                </div>

                <div style={styles.locationRow}>
                  <span style={styles.label}>Latitude</span>
                  <span style={styles.value}>
                    {Number(selectedPoint.lat).toFixed(4)}°
                  </span>
                </div>

                <div style={styles.locationRow}>
                  <span style={styles.label}>Longitude</span>
                  <span style={styles.value}>
                    {Number(selectedPoint.lng).toFixed(4)}°
                  </span>
                </div>
              </div>

              <div style={styles.approximate}>
                Approximate IP-based Location
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const styles = {
    card: {
      backgroundColor: "var(--soc-card)",
      border: "1px solid var(--soc-border)",
      borderRadius: "12px",
      padding: "22px",
    },

    title: {
      color: "var(--soc-cyan)",
      fontSize: "0.78rem",
      letterSpacing: "1px",
      marginBottom: "6px",
    },

    hint: {
      color: "var(--soc-muted)",
      fontSize: "0.72rem",
      marginBottom: "14px",
    },

    mapArea: {
      position: "relative",
      width: "100%",
      maxWidth: "500px",
      minHeight: "420px",
      margin: "0 auto",
    },

    globeWrap: {
      width: "100%",
      height: "420px",
      display: "flex",
      justifyContent: "center",
      position: "relative",
      zIndex: 1,
    },

    locationCard: {
      position: "absolute",
      top: "10px",
      right: "10px",
      width: "70%",
      maxWidth: "220px",
      backgroundColor: "rgba(13, 23, 40, 0.96)",
      border: "1px solid #27d8f2",
      borderRadius: "10px",
      padding: "14px",
      fontFamily: "monospace",
      zIndex: 5,
      boxShadow: "0 0 18px rgba(39,216,242,0.18)",
      backdropFilter: "blur(6px)",
    },

    locationHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#27d8f2",
      fontSize: "0.72rem",
      letterSpacing: "1px",
      marginBottom: "12px",
    },

    closeButton: {
      background: "transparent",
      border: "none",
      color: "#aaa",
      fontSize: "20px",
      cursor: "pointer",
      lineHeight: "1",
      padding: "0 2px",
    },

    locationContent: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },

    locationRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "12px",
      fontSize: "0.68rem",
    },

    label: {
      color: "var(--soc-muted)",
      whiteSpace: "nowrap",
    },

    value: {
      color: "#fff",
      textAlign: "right",
      wordBreak: "break-word",
    },

    approximate: {
      marginTop: "12px",
      paddingTop: "9px",
      borderTop: "1px solid rgba(39,216,242,0.2)",
      color: "#888",
      fontSize: "0.58rem",
      textAlign: "center",
    },
  };

  export default ThreatGlobe;