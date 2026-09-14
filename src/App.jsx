import ThreatGlobe from "./components/sections/ThreatGlobe";
import { useState, useEffect } from "react";
import { checkBackendHealth } from "./services/dataProvider";
import Sidebar from "./components/common/Sidebar";
import HomePage from "./pages/HomePage";
import AnalyzingPage from "./pages/AnalyzingPage";
import ThreatAnalysisPage from "./pages/ThreatAnalysisPage";
import FinalReportPage from "./pages/FinalReportPage";
import ReportSectionPage from "./pages/ReportSectionPage";
import CasesListPage from "./pages/CasesListPage";
import CaseDetailPage from "./pages/CaseDetailPage";
import EmailDetailPage from "./pages/EmailDetailPage";
import IOCDetailPage from "./pages/IOCDetailPage";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedEmailId, setUploadedEmailId] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [initialReportTab, setInitialReportTab] = useState("evidence");
  const [selectedReportSection, setSelectedReportSection] = useState(null);
  const [reportSectionBackTarget, setReportSectionBackTarget] = useState("finalReport");
  const [cameFromCase, setCameFromCase] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [selectedIOCValue, setSelectedIOCValue] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);

  useEffect(() => {
    checkBackendHealth().then((isOnline) => setBackendOnline(isOnline));
  }, []);

  const handleStartAnalysis = (file, emailId) => {
    setUploadedFile(file);
    setUploadedEmailId(emailId);
    setCurrentPage("analyzing");
  };

  const handleAnalysisComplete = () => {
    setCurrentPage("threatAnalysis");
  };

  const handleNext = () => {
    setInitialReportTab("evidence");
    setCameFromCase(false);
    setCurrentPage("finalReport");
  };

  const handleSidebarNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleSelectCase = (caseId) => {
    setSelectedCaseId(caseId);
    setCurrentPage("caseDetail");
  };

  const handleViewReport = () => {
    setSelectedReportSection("forensicReport");
    setReportSectionBackTarget("caseDetail");
    setCameFromCase(true);
    setCurrentPage("reportSection");
  };

  const handleViewGraph = () => {
    setSelectedReportSection("graphView");
    setReportSectionBackTarget("caseDetail");
    setCameFromCase(true);
    setCurrentPage("reportSection");
  };

  const handleOpenReportSection = (section) => {
    setSelectedReportSection(section);
    setReportSectionBackTarget("finalReport");
    setCurrentPage("reportSection");
  };

  const handleBackFromReportSection = () => {
    setSelectedReportSection(null);
    setCurrentPage(reportSectionBackTarget);
  };

  const handleBackToCase = () => {
    setCurrentPage("caseDetail");
  };

  const handleViewEmail = (emailId) => {
    setSelectedEmailId(emailId);
    setCurrentPage("emailDetail");
  };

  const handleInvestigateIOC = (iocValue) => {
    setSelectedIOCValue(iocValue);
    setCurrentPage("iocDetail");
  };

  const handleBackFromDetail = () => {
    setCurrentPage("caseDetail");
  };

  const showSidebar = true;

  return (
    <div>
      {!backendOnline && (
        <div
          style={{
            backgroundColor: "var(--soc-danger)",
            color: "#fff",
            textAlign: "center",
            padding: "8px",
            fontSize: "0.85rem",
            fontFamily: "var(--font-ui)",
          }}
        >
          ⚠ Backend unavailable — showing demo data
        </div>
      )}

      <div style={{ display: "flex" }}>
        {showSidebar && (
          <Sidebar currentPage={currentPage} onNavigate={handleSidebarNavigate} />
        )}

        <div style={{ flex: 1, marginLeft: showSidebar ? "210px" : 0 }}>
          {currentPage === "home" && (
            <HomePage onStartAnalysis={handleStartAnalysis} />
          )}

          {currentPage === "analyzing" && (
            <AnalyzingPage
              fileName={uploadedFile?.name}
              onAnalysisComplete={handleAnalysisComplete}
            />
          )}

          {currentPage === "threatAnalysis" && (
            <ThreatAnalysisPage onNext={handleNext} emailId={uploadedEmailId} />
          )}

          {currentPage === "finalReport" && (
            <FinalReportPage
              initialTab={initialReportTab}
              onOpenSection={handleOpenReportSection}
              showBackButton={cameFromCase}
              onBack={handleBackToCase}
              emailId={uploadedEmailId}
            />
          )}

          {currentPage === "reportSection" && (
            <ReportSectionPage
              section={selectedReportSection}
              onBack={handleBackFromReportSection}
              backLabel={
                reportSectionBackTarget === "caseDetail"
                  ? "← Back to Case"
                  : "← Back to Full Report"
              }
              emailId={uploadedEmailId}
              caseId={selectedCaseId}
            />
          )}

          {currentPage === "casesList" && (
            <CasesListPage onSelectCase={handleSelectCase} />
          )}

          {currentPage === "caseDetail" && (
            <CaseDetailPage
              caseId={selectedCaseId}
              onViewReport={handleViewReport}
              onViewGraph={handleViewGraph}
              onCloseCase={() => setCurrentPage("casesList")}
              onViewEmail={handleViewEmail}
              onInvestigateIOC={handleInvestigateIOC}
            />
          )}

          {currentPage === "emailDetail" && (
            <EmailDetailPage emailId={selectedEmailId} onBack={handleBackFromDetail} />
          )}

          {currentPage === "iocDetail" && (
            <IOCDetailPage iocValue={selectedIOCValue} onBack={handleBackFromDetail} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;