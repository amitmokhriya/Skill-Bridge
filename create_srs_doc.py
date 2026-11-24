import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}>'
                      f'<w:top w:w="{top}" w:type="dxa"/>'
                      f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
                      f'<w:left w:w="{left}" w:type="dxa"/>'
                      f'<w:right w:w="{right}" w:type="dxa"/>'
                      f'</w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def add_hyperlink(paragraph, url, text, color="1D4ED8", underline=True):
    part = paragraph.part
    r_id = part.relate_to(url, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)
    hyperlink = parse_xml(f'<w:hyperlink {nsdecls("w")} r:id="{r_id}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>')
    new_run = parse_xml(f'<w:r {nsdecls("w")}><w:rPr><w:color w:val="{color}"/>'
                        f'{"<w:u w:val=\'single\'/>" if underline else ""}</w:rPr>'
                        f'<w:t>{text}</w:t></w:r>')
    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)

def create_srs_document(filename="SkillBridge_Software_Requirement_Specification.docx"):
    doc = Document()

    # Set Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    NAVY = RGBColor(15, 23, 42)      # #0F172A
    COBALT = RGBColor(29, 78, 216)   # #1D4ED8
    SLATE = RGBColor(51, 65, 85)     # #334155
    MUTED = RGBColor(100, 116, 139)  # #64748B
    BLACK = RGBColor(0, 0, 0)

    # Helper formatters
    def add_title(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(24)
        p.paragraph_format.space_after = Pt(8)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(24)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_subtitle(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(20)
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(13)
        run.font.color.rgb = COBALT
        run.font.italic = True
        return p

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = COBALT
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(11.5)
        run.font.bold = True
        run.font.color.rgb = SLATE
        return p

    def add_body(text, bold_prefix=None, space_after=6):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            run_b = p.add_run(bold_prefix)
            run_b.font.name = "Calibri"
            run_b.font.size = Pt(10.5)
            run_b.font.bold = True
            run_b.font.color.rgb = NAVY
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(10.5)
        run.font.color.rgb = SLATE
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            run_b = p.add_run(bold_prefix)
            run_b.font.name = "Calibri"
            run_b.font.size = Pt(10.5)
            run_b.font.bold = True
            run_b.font.color.rgb = NAVY
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(10.5)
        run.font.color.rgb = SLATE
        return p

    def add_callout(text, bold_title="NOTE:"):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.left_indent = Inches(0.25)
        p.paragraph_format.right_indent = Inches(0.25)
        run_b = p.add_run(f"[{bold_title}] ")
        run_b.font.name = "Calibri"
        run_b.font.size = Pt(10)
        run_b.font.bold = True
        run_b.font.color.rgb = COBALT
        run = p.add_run(text)
        run.font.name = "Calibri"
        run.font.size = Pt(10)
        run.font.italic = True
        run.font.color.rgb = SLATE
        return p

    def add_code_block(code_text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.left_indent = Inches(0.2)
        run = p.add_run(code_text)
        run.font.name = "Courier New"
        run.font.size = Pt(9)
        run.font.color.rgb = RGBColor(30, 41, 59)
        return p

    # ==================== COVER PAGE ====================
    add_title("SOFTWARE REQUIREMENT SPECIFICATION (SRS)")
    add_subtitle("for SkillBridge: Curriculum-to-Industry Skill Gap Analytics Platform\nAcademic Quality Assurance, Board of Studies (BoS) & Accreditation Portal")

    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_meta.paragraph_format.space_before = Pt(20)
    p_meta.paragraph_format.space_after = Pt(40)
    
    r = p_meta.add_run("Department of Computer Science & Engineering\n")
    r.font.name = "Calibri"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = NAVY

    r = p_meta.add_run("B.Tech Computer Science & Engineering • Academic Regulation R22\nAcademic Year: 2026–2027 (Odd Semester)\n\n")
    r.font.name = "Calibri"
    r.font.size = Pt(11)
    r.font.color.rgb = SLATE

    r = p_meta.add_run("Author & Lead Developer: ")
    r.font.bold = True
    r = p_meta.add_run("Amit Mokhriya\n")
    r = p_meta.add_run("Compliance Framework: ")
    r.font.bold = True
    r = p_meta.add_run("NBA Tier-I SAR Criterion 2 & NAAC Sub-criterion 1.1 (Outcome-Based Education)\n")
    r = p_meta.add_run("Standard: ")
    r.font.bold = True
    r = p_meta.add_run("IEEE Std 830-1998 Recommended Practice for Software Requirements Specifications")

    doc.add_page_break()

    # ==================== TABLE OF CONTENTS ====================
    add_h1("TABLE OF CONTENTS")
    
    toc_data = [
        ("REVISION HISTORY", "II"),
        ("1. INTRODUCTION", "1"),
        ("  1.1 Purpose", "1"),
        ("  1.2 Scope", "1"),
        ("  1.3 Definitions, Acronyms, and Abbreviations", "2"),
        ("  1.4 References", "2"),
        ("  1.5 Overview", "3"),
        ("2. GENERAL DESCRIPTION", "3"),
        ("  2.1 Product Perspective", "3"),
        ("  2.2 Product Functions", "4"),
        ("  2.3 User Characteristics", "4"),
        ("  2.4 General Constraints", "5"),
        ("  2.5 Assumptions and Dependencies", "5"),
        ("3. SPECIFIC REQUIREMENTS", "6"),
        ("  3.1 External Interface Requirements", "6"),
        ("    3.1.1 User Interfaces", "6"),
        ("    3.1.2 Hardware Interfaces", "7"),
        ("    3.1.3 Software Interfaces", "7"),
        ("    3.1.4 Communications Interfaces", "8"),
        ("  3.2 Functional Requirements", "8"),
        ("    3.2.1 Real-Time Google Authentication & Profile Management", "8"),
        ("    3.2.2 Curriculum & Course Syllabus Structure Cataloging", "9"),
        ("    3.2.3 Industry Roles & Competency Matrix Management", "10"),
        ("    3.2.4 Outcome-Based Education (OBE) Depth Mapping Engine", "11"),
        ("    3.2.5 Mathematical Skill Gap Calculation & Blindspot Identification", "12"),
        ("    3.2.6 Interactive Visual Analytics Dashboard", "13"),
        ("    3.2.7 Accreditation Dossier & BoS Formal Export Engine", "14"),
        ("    3.2.8 Institutional Workspace Reset & Approved Syllabus Seeding", "15"),
        ("  3.5 Non-Functional Requirements", "16"),
        ("    3.5.1 Performance", "16"),
        ("    3.5.2 Reliability", "16"),
        ("    3.5.3 Availability", "16"),
        ("    3.5.4 Security", "17"),
        ("    3.5.5 Maintainability", "17"),
        ("    3.5.6 Portability", "17"),
        ("  3.7 Design Constraints", "18"),
        ("  3.9 Other Requirements", "18"),
        ("4. ANALYSIS MODELS", "19"),
        ("  4.1 Data Flow Diagrams (DFD)", "19"),
        ("    4.1.1 Level 0 DFD (Context Diagram)", "19"),
        ("    4.1.2 Level 1 DFD (Subsystem Decomposition)", "20"),
        ("    4.1.3 Level 2 DFD (Gap Calculation & Analysis Engine)", "21"),
        ("    4.1.4 Cloud Firestore Data Dictionary & Schema Model", "22"),
        ("5. GITHUB LINK", "23"),
        ("6. DEPLOYED LINK", "24"),
    ]

    t_toc = doc.add_table(rows=len(toc_data), cols=2)
    t_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_toc, color="E2E8F0")

    for idx, (title_str, page_str) in enumerate(toc_data):
        row = t_toc.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(5.2)
        c1.width = Inches(1.3)
        set_cell_margins(c0, top=60, bottom=60, left=100, right=100)
        set_cell_margins(c1, top=60, bottom=60, left=100, right=100)
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(0)
        p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(title_str)
        r0.font.name = "Calibri"
        r0.font.size = Pt(10)
        if not title_str.startswith("  "):
            r0.font.bold = True
            r0.font.color.rgb = NAVY
            set_cell_background(c0, "F1F5F9")
            set_cell_background(c1, "F1F5F9")
        else:
            r0.font.color.rgb = SLATE

        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p1.paragraph_format.space_before = Pt(0)
        p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(page_str)
        r1.font.name = "Calibri"
        r1.font.size = Pt(10)
        if not title_str.startswith("  "):
            r1.font.bold = True
            r1.font.color.rgb = NAVY
        else:
            r1.font.color.rgb = SLATE

    # ==================== REVISION HISTORY ====================
    add_h1("REVISION HISTORY")
    
    rev_headers = ["Version", "Primary Date", "Reason for Change / Release Notes", "Author & Role"]
    rev_rows = [
        ("1.0.0", "15/10/2026", "Initial IEEE SRS specification for SkillBridge platform. Defined core academic modules, OBE mapping models, and Firebase backend scope.", "Amit Mokhriya (Lead Architect)"),
        ("1.1.0", "05/11/2026", "Incorporated Outcome-Based Education (OBE) Depth Tiers (Bloom's Taxonomy levels L1-L3), weighted gap formula, and blindspot threshold logic.", "Amit Mokhriya (Lead Architect)"),
        ("1.2.0", "20/11/2026", "Replaced synthetic demo authentication with real Firebase Google Single Sign-On (GoogleAuthProvider) and per-user Firestore isolation.", "Amit Mokhriya (Lead Architect)"),
        ("2.0.0", "24/11/2026", "Production Release: Complete institutional academic redesign for B.Tech CSE (Regulation R22). Verified live Firebase deployment at skillbridge-6d9cf.web.app.", "Amit Mokhriya (Lead Architect)")
    ]

    t_rev = doc.add_table(rows=len(rev_rows)+1, cols=4)
    t_rev.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_rev)

    for i, h in enumerate(rev_headers):
        c = t_rev.rows[0].cells[i]
        set_cell_background(c, "0F172A")
        set_cell_margins(c, top=100, bottom=100, left=120, right=120)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    for r_idx, row_data in enumerate(rev_rows):
        bg = "FFFFFF" if r_idx % 2 == 0 else "F8FAFC"
        for c_idx, val in enumerate(row_data):
            c = t_rev.rows[r_idx+1].cells[c_idx]
            set_cell_background(c, bg)
            set_cell_margins(c, top=80, bottom=80, left=120, right=120)
            p = c.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.name = "Calibri"
            r.font.size = Pt(9.5)
            r.font.color.rgb = SLATE

    doc.add_page_break()

    # ==================== 1. INTRODUCTION ====================
    add_h1("1. INTRODUCTION")
    add_body("The Software Requirement Specification (SRS) document provides a comprehensive, rigorous specification of the software requirements for the SkillBridge Academic Analytics Platform. It details the functional interfaces, performance metrics, data architecture, mathematical gap calculation engine, and system boundary constraints required by software engineers, curriculum designers, Board of Studies (BoS) committees, and institutional accreditation evaluators.")

    add_h2("1.1 Purpose")
    add_body("The purpose of this document is to specify all functional, operational, and non-functional requirements for the SkillBridge platform. SkillBridge is an automated, web-based curriculum quality analytics system designed specifically for higher education engineering institutions. The intended audience includes:")
    add_bullet("Responsible for defining module syllabus content, lecture allocations, course outcomes (COs), and mapping academic units to industry competencies.", "Faculty Course Coordinators & Curriculum Developers: ")
    add_bullet("Responsible for approving syllabus revisions, analyzing multi-semester coverage deficits, and prioritizing corrective curriculum updates.", "Board of Studies (BoS) Members & Academic Deans: ")
    add_bullet("National Board of Accreditation (NBA Tier-I/II) and NAAC peer review teams verifying compliance with Outcome-Based Education (OBE) and curriculum enrichment requirements.", "Accreditation Audit Committees: ")
    add_bullet("Responsible for maintaining, deploying, testing, and extending the Next.js static SPA architecture and Firebase cloud infrastructure.", "Software Engineers & System Architects: ")

    add_h2("1.2 Scope")
    add_body("The software product being produced is named SkillBridge (Version 2.0.0). It is engineered as a zero-cost, high-performance, client-side Single Page Application (SPA) deployed globally via Firebase Hosting and Cloud Firestore.")
    add_body("What the software product WILL DO:", bold_prefix="System Capabilities: ")
    add_bullet("Support institutional Google Single Sign-On (SSO) authentication using Firebase Authentication (GoogleAuthProvider) with strict per-faculty workspace isolation.", "Google Authentication: ")
    add_bullet("Catalog hierarchical academic curriculums including Academic Programs, Courses (with L-T-P lecture-tutorial-practical credits and course codes), and granular syllabus topics/modules.", "Curriculum Cataloging: ")
    add_bullet("Manage industry benchmark job profiles (e.g., Full Stack Engineer, Cloud Architect, Data Scientist) and associated technical competencies weighted from Level 1 (Introductory) to Level 5 (Critical).", "Industry Benchmarking: ")
    add_bullet("Map academic syllabus topics to industry competencies across Bloom's Taxonomy cognitive depth tiers: Level 1 (Knowledge - 25%), Level 2 (Application - 60%), and Level 3 (Synthesis - 100%).", "Depth Skill Mapping: ")
    add_bullet("Execute a deterministic, client-side mathematical evaluation engine that calculates Weighted Role Coverage, Net Curriculum Gap, and flags Urgent Curriculum Blindspots (critical skills with coverage < 60%).", "Analytical Gap Engine: ")
    add_bullet("Render interactive, multi-dimensional SVG visualizations (Radar Charts, Deficit Bar Charts, Distribution Gauges) using Recharts.", "Visual Command Center: ")
    add_bullet("Generate downloadable CSV audit dossiers and formal, print-optimized Self-Study Reports (SAR) formatted for NBA Criterion 2 and NAAC Sub-criterion 1.1 compliance.", "Accreditation Dossiers: ")
    add_bullet("Provide an instant workspace restoration mechanism to seed approved university CSE model syllabuses without duplicating existing records.", "Workspace Seeding: ")

    add_body("What the software product WILL NOT DO:", bold_prefix="System Boundaries: ")
    add_bullet("SkillBridge does not administer student examinations, grading portals, or Learning Management System (LMS) assignment submissions.", "No Student LMS: ")
    add_bullet("SkillBridge does not execute backend server cron jobs or require paid cloud compute tiers (100% compliant with Firebase Spark free tier).", "Zero Server Compute: ")
    add_bullet("SkillBridge does not share or leak syllabus drafting data across disparate faculty accounts; all database records are strictly partitioned by authenticated Google Firebase UID.", "No Cross-User Leakage: ")

    add_h2("1.3 Definitions, Acronyms, and Abbreviations")
    
    defs_data = [
        ("SRS", "Software Requirement Specification - Formally defined by IEEE Std 830-1998."),
        ("OBE", "Outcome-Based Education - Educational theory focusing on measurable graduate outcomes."),
        ("BoS", "Board of Studies - University statutory body responsible for reviewing and approving academic curriculum."),
        ("CAC", "Curriculum Advisory Committee - Faculty committee that coordinates industrial input for syllabus revision."),
        ("NBA", "National Board of Accreditation - Indian accreditation body evaluating engineering programs via Tier-I SAR."),
        ("NAAC", "National Assessment and Accreditation Council - Institutional assessment agency evaluating curriculum design."),
        ("SAR", "Self Assessment Report - Comprehensive institutional accreditation compliance dossier."),
        ("CO / PO", "Course Outcome / Program Outcome - Specific measurable proficiencies attained by students."),
        ("L-T-P", "Lecture-Tutorial-Practical - Standard academic credit distribution scheme (e.g., 3-0-2 for 4 credits)."),
        ("Bloom's Taxonomy", "Hierarchical classification of educational learning objectives (Remembering to Evaluating/Creating)."),
        ("SPA", "Single Page Application - Web application executing entirely inside the client browser without page reloads."),
        ("UID", "Unique Identifier - 28-character cryptographic token assigned to authenticated Google users by Firebase."),
        ("SSO", "Single Sign-On - Authentication mechanism permitting access through institutional Google credentials."),
        ("CIDR", "Classless Inter-Domain Routing - Network addressing format.")
    ]

    t_defs = doc.add_table(rows=len(defs_data)+1, cols=2)
    t_defs.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_defs)

    t_defs.rows[0].cells[0].paragraphs[0].add_run("Term / Acronym").font.bold = True
    t_defs.rows[0].cells[0].paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
    t_defs.rows[0].cells[1].paragraphs[0].add_run("Definition & Technical Meaning").font.bold = True
    t_defs.rows[0].cells[1].paragraphs[0].runs[0].font.color.rgb = RGBColor(255, 255, 255)
    set_cell_background(t_defs.rows[0].cells[0], "0F172A")
    set_cell_background(t_defs.rows[0].cells[1], "0F172A")
    set_cell_margins(t_defs.rows[0].cells[0], top=80, bottom=80, left=120, right=120)
    set_cell_margins(t_defs.rows[0].cells[1], top=80, bottom=80, left=120, right=120)

    for i, (term, defn) in enumerate(defs_data):
        row = t_defs.rows[i+1]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(1.8)
        c1.width = Inches(4.7)
        bg = "FFFFFF" if i % 2 == 0 else "F8FAFC"
        set_cell_background(c0, bg)
        set_cell_background(c1, bg)
        set_cell_margins(c0, top=60, bottom=60, left=100, right=100)
        set_cell_margins(c1, top=60, bottom=60, left=100, right=100)
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(0); p0.paragraph_format.space_after = Pt(0)
        r0 = p0.add_run(term)
        r0.font.name = "Calibri"; r0.font.size = Pt(9.5); r0.font.bold = True; r0.font.color.rgb = NAVY

        p1 = c1.paragraphs[0]
        p1.paragraph_format.space_before = Pt(0); p1.paragraph_format.space_after = Pt(0)
        r1 = p1.add_run(defn)
        r1.font.name = "Calibri"; r1.font.size = Pt(9.5); r1.font.color.rgb = SLATE

    add_h2("1.4 References")
    add_bullet("IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications.", "1. ")
    add_bullet("NBA Tier-I Accreditation Manual for Undergraduate Engineering Programs, Criterion 2: Curriculum and Teaching-Learning Processes (2023).", "2. ")
    add_bullet("NAAC Manual for Universities and Autonomous Colleges, Criteria I: Curricular Aspects (Sub-criterion 1.1 Curricular Design and Development).", "3. ")
    add_bullet("ACM / IEEE-CS Computing Curricula 2020 (CC2020): Paradigms for Future Computing Education.", "4. ")
    add_bullet("AICTE Model Curriculum for Undergraduate Degree Courses in Computer Science & Engineering (Volume I & II).", "5. ")
    add_bullet("NASSCOM FutureSkills Prime: National Occupational Standards (NOS) & Competency Frameworks.", "6. ")
    add_bullet("Next.js 14 Documentation: Static HTML Export & Client-Side SPA Architecture (Vercel, 2024).", "7. ")
    add_bullet("Google Firebase Documentation: Web SDK v10, Cloud Firestore Security Rules, and Firebase Hosting (Google Cloud, 2024).", "8. ")

    add_h2("1.5 Overview")
    add_body("The remainder of this SRS document is structured as follows:")
    add_bullet("Provides product perspective, user characteristics, environmental constraints, operational assumptions, and dependency boundaries.", "Section 2 (General Description): ")
    add_bullet("Specifies external interfaces (UI, hardware, software, communications), detailed functional requirements (FR1-FR8) in structured use-case format, non-functional engineering attributes (performance, reliability, security), and design constraints.", "Section 3 (Specific Requirements): ")
    add_bullet("Presents formal analysis models including Level 0 Context Diagram, Level 1 Subsystem Decomposition, Level 2 Analytical Engine Decomposition, and the Cloud Firestore Data Dictionary.", "Section 4 (Analysis Models): ")
    add_bullet("Supplies the official GitHub source code repository link, branching guidelines, and file catalog.", "Section 5 (GitHub Link): ")
    add_bullet("Supplies the production live Firebase Hosting deployment link, edge CDN verification metrics, and validation credentials.", "Section 6 (Deployed Link): ")

    doc.add_page_break()

    # ==================== 2. GENERAL DESCRIPTION ====================
    add_h1("2. GENERAL DESCRIPTION")
    add_body("This section frames the product within its operational ecosystem, summarizing core functions, faculty user profiles, technical limitations, and foundational assumptions.")

    add_h2("2.1 Product Perspective")
    add_body("SkillBridge is an autonomous, cloud-integrated academic quality management system. Historically, curriculum syllabus reviews across engineering colleges are conducted using manual, static Microsoft Word syllabuses or spreadsheets. This manual workflow suffers from three severe deficiencies:")
    add_bullet("Curriculum committees fail to quantify the exact percentage of industry competencies addressed by multi-semester academic courses.", "1. Lack of Objective Quantification: ")
    add_bullet("Critical competencies (e.g., Docker, REST APIs, CI/CD, React) are frequently omitted due to syllabus inertia, resulting in graduate employability deficits.", "2. Undetected Curriculum Blindspots: ")
    add_bullet("Assembling accreditation self-study documentation for NBA and NAAC audits requires weeks of manual compilation.", "3. High Accreditation Overhead: ")
    add_body("SkillBridge directly resolves these challenges by operating as an automated bridge between the university course handbook and contemporary industry skill frameworks. Architecturally, SkillBridge functions as an optimized Next.js 14 Single Page Application interacting directly with Google Cloud Firestore and Firebase Authentication through browser-side SDKs. It eliminates middle-tier application servers, thereby achieving zero maintenance overhead and 100% operational reliability on Google Cloud's globally distributed Spark tier.")

    add_h2("2.2 Product Functions")
    add_body("The high-level functions executed by the SkillBridge platform include:")
    add_bullet("Cryptographically validates institutional Google accounts via GoogleAuthProvider, creates isolated user records in Firestore, and maintains persistent sessions.", "1. Faculty Authentication & Workspace Partitioning: ")
    add_bullet("Enables coordinators to create, inspect, modify, and delete programs, courses, credit weights (L-T-P), and modular syllabus topics.", "2. Academic Curriculum Structure Cataloging: ")
    add_bullet("Maintains a library of benchmark technical job roles and industry skills scored with priority importance weights from 1 to 5.", "3. Industry Competencies Benchmarking: ")
    add_bullet("Facilitates cross-linking between academic topics and industry skills, establishing depth tiers according to Bloom's Revised Taxonomy (Level 1: 25%, Level 2: 60%, Level 3: 100%).", "4. Outcome-Based Education (OBE) Depth Mapping: ")
    add_bullet("Executes real-time mathematical calculations to derive Weighted Role Coverage, Net Skill Gaps, and automated Priority Syllabus Revision agendas.", "5. Mathematical Curriculum Gap Engine: ")
    add_bullet("Renders real-time visual summaries including multi-axis Radar alignment charts, bar charts, and status indicators.", "6. Visual Analytics & Reporting: ")
    add_bullet("Exports formatted accreditation dossiers in CSV format and print-ready HTML/PDF documents matching NBA Criterion 2 and NAAC Sub-criterion 1.1 requirements.", "7. Accreditation Dossier Generation: ")
    add_bullet("Provides a one-click initialization tool that populates the faculty workspace with a pre-configured B.Tech CSE model syllabus.", "8. Standard Model Syllabus Seeding: ")

    add_h2("2.3 User Characteristics")
    add_body("The user community of SkillBridge consists of academic professionals with diverse institutional responsibilities:")
    add_bullet("Technical proficiency: High. Responsibilities: Adding syllabus modules, establishing topic-to-skill links, and evaluating course outcome alignments.", "Course Coordinators / Assistant Professors: ")
    add_bullet("Technical proficiency: Moderate to High. Responsibilities: Reviewing department-wide coverage statistics, identifying syllabus deficiencies, and establishing syllabus revision agendas.", "Head of Department (HoD) / Board of Studies (BoS) Chairs: ")
    add_bullet("Technical proficiency: Moderate. Responsibilities: Inspecting evidence-based documentation, verifying OBE alignment, and auditing institutional curriculum enhancement initiatives.", "NBA / NAAC Accreditation Evaluators: ")

    add_h2("2.4 General Constraints")
    add_body("The design and implementation of SkillBridge are subject to the following technical and operational constraints:")
    add_bullet("The software must run entirely within the quotas of the Firebase Spark (Free) plan (50,000 Firestore reads/day, 20,000 writes/day, 10 GB/month hosting bandwidth).", "1. Zero-Cost Infrastructure Constraint: ")
    add_bullet("The Next.js application must be compiled as a static client export ('output: export') into the 'out/' directory. Dynamic server-side Node.js runtimes (SSR/Edge) are prohibited.", "2. Static SPA Constraint: ")
    add_bullet("All client-side database transactions must enforce the Firestore Security Rule: request.auth != null && request.auth.uid == userId. Cross-user reading or writing is blocked at the database kernel level.", "3. Security & Isolation Constraint: ")
    add_bullet("All data visualizations must be rendered using SVG-based client libraries (Recharts) capable of responsive scaling across desktop and mobile screens.", "4. Client-Side Rendering Constraint: ")

    add_h2("2.5 Assumptions and Dependencies")
    add_bullet("Faculty members possess active Google accounts capable of authenticating via Firebase GoogleAuthProvider Single Sign-On.", "1. User Account Availability: ")
    add_bullet("Client devices have an active internet connection capable of communicating over HTTPS (Port 443) to Firebase and Google APIs.", "2. Network Connectivity: ")
    add_bullet("Client web browsers support ECMAScript 2020+ (ES11) and modern HTML5 CSS Grid/Flexbox layouts (Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Apple Safari 14+).", "3. Browser Capabilities: ")

    doc.add_page_break()

    # ==================== 3. SPECIFIC REQUIREMENTS ====================
    add_h1("3. SPECIFIC REQUIREMENTS")
    add_body("This section details the precise software requirements guiding the design, coding, and verification of SkillBridge. Each requirement is unambiguous, traceable, verifiable, and uniquely numbered.")

    add_h2("3.1 External Interface Requirements")

    add_h3("3.1.1 User Interfaces")
    add_body("The user interface is engineered with Tailwind CSS following an institutional academic design language:")
    add_bullet("Desktop (>=1280px), Laptop (1024px-1279px), Tablet (768px-1023px), and Mobile (<768px). Responsive collapsible sidebar and sticky command header.", "Responsive Layout: ")
    add_bullet("Primary institutional Oxford Navy (#0F172A), dignified Cobalt Blue (#1D4ED8), Slate neutral tones (#334155, #64748B), and high-contrast status chips (Emerald #059669 for covered, Crimson #DC2626 for blindspots).", "Academic Color Palette: ")
    add_bullet("Persistent Dark/Light mode toggle stored in localStorage, applying smooth CSS transitions across background and typography tokens.", "Theme System: ")
    add_bullet("Dedicated print CSS directives (@media print) that strip interactive sidebars, buttons, and navigation elements, formatting data tables cleanly for physical paper and PDF archival.", "Print Stylesheet: ")

    add_h3("3.1.2 Hardware Interfaces")
    add_bullet("Any modern personal computer, laptop, tablet, or smartphone equipped with a display resolution of at least 320x568 pixels (optimized for 1440x900 and 1920x1080 desktop displays).", "Client Device: ")
    add_bullet("Standard pointing device (mouse, trackpad, touchscreen) and alphanumeric keyboard.", "Input Devices: ")

    add_h3("3.1.3 Software Interfaces")
    add_bullet("React 18.3.1 with Next.js 14.2.35 App Router (Static Client Export architecture).", "Frontend Framework: ")
    add_bullet("Firebase Web SDK v10.14.1 (firebase/app, firebase/auth, firebase/firestore).", "Database & Authentication: ")
    add_bullet("Recharts v2.13.3 (SVG Radar, Bar, and Gauge visualizations).", "Charting Engine: ")
    add_bullet("Lucide React v0.454.0 (Consistent academic SVG iconography).", "Iconography: ")

    add_h3("3.1.4 Communications Interfaces")
    add_bullet("Secure Hypertext Transfer Protocol (HTTPS) over TLS 1.3 enforced across all web assets and edge endpoints.", "Protocol: ")
    add_bullet("WebSocket and HTTP/2 bi-directional event streams for real-time Cloud Firestore snapshot synchronization.", "Data Streaming: ")
    add_bullet("Google Identity Toolkit REST API endpoints (identitytoolkit.googleapis.com) for OAuth 2.0 PKCE token exchange.", "Auth Endpoints: ")

    add_h2("3.2 Functional Requirements")

    # FR1
    add_h3("3.2.1 Real-Time Google Authentication & Isolated Profile Management (FR1)")
    add_body("The system shall authenticate faculty users using Google OAuth 2.0 via Firebase Authentication and isolate all workspace data.", "Introduction: ")
    add_bullet("Google user credentials via browser popup or redirect.", "Inputs: ")
    add_bullet("1) Invoke signInWithPopup(auth, GoogleAuthProvider). 2) Listen to onAuthStateChanged. 3) Extract user.uid, user.displayName, user.email, user.photoURL. 4) Check if Firestore document users/{uid}/profile/main exists. 5) If new, create profile record with login timestamps.", "Processing: ")
    add_bullet("Authenticated session, populated AuthContext, redirection to /dashboard, display of faculty name and profile picture in header.", "Outputs: ")
    add_bullet("If popup is closed or blocked, display informative toast. If unauthorized user accesses protected routes, redirect immediately to /login.", "Error Handling: ")

    # FR2
    add_h3("3.2.2 Academic Curriculum & Course Syllabus Cataloging (FR2)")
    add_body("The system shall provide full CRUD management for academic programs, courses with credit structures, and granular syllabus topics.", "Introduction: ")
    add_bullet("Program Name, Department, Academic Regulation, Course Code (e.g. CS201), Course Title, L-T-P credits, and Unit Topic descriptions.", "Inputs: ")
    add_bullet("Store records under users/{uid}/programs, users/{uid}/subjects, and users/{uid}/topics. Validate required fields and course code uniqueness.", "Processing: ")
    add_bullet("Real-time hierarchical syllabus view showing Courses, Contact Hours, and Unit breakdowns.", "Outputs: ")
    add_bullet("Display field validation warnings if course code or title is omitted. Cascade deletion confirmations when deleting parent courses.", "Error Handling: ")

    # FR3
    add_h3("3.2.3 Industry Roles & Benchmark Skill Matrix Management (FR3)")
    add_body("The system shall manage benchmark tech job roles and associated technical competencies with 1-5 importance weights.", "Introduction: ")
    add_bullet("Job Role Title (e.g. Full Stack Developer), Role Description, Skill Name (e.g. Docker), Category (Frontend/Backend/DevOps/Data), and Importance Weight (1 to 5).", "Inputs: ")
    add_bullet("Persist records in users/{uid}/industryRoles and users/{uid}/industrySkills. Associate skills with roles through roleId foreign keys.", "Processing: ")
    add_bullet("Catalog view with category filtering, search bars, and importance badges (1: Fundamental to 5: Mission Critical).", "Outputs: ")
    add_bullet("Reject duplicate skill names within the same role; enforce weight range between 1 and 5.", "Error Handling: ")

    # FR4
    add_h3("3.2.4 Outcome-Based Education (OBE) Depth Mapping Engine (FR4)")
    add_body("The system shall enable faculty to link syllabus topics with industry skills and specify Bloom's Taxonomy cognitive depth tiers.", "Introduction: ")
    add_bullet("Topic ID, Industry Skill ID, Coverage Depth Tier (Level 1: 25%, Level 2: 60%, Level 3: 100%), and optional justification notes.", "Inputs: ")
    add_bullet("Upsert mapping records in users/{uid}/skillMappings with composite keys topicId_skillId. Update real-time link counters.", "Processing: ")
    add_bullet("Matrix showing linked courses, mapped skills, active depth badges, and unmapped coverage indicators.", "Outputs: ")
    add_bullet("Prevent orphan mappings when subjects or skills are removed; validate depth tier selection.", "Error Handling: ")

    # FR5
    add_h3("3.2.5 Mathematical Skill Gap Calculation & Blindspot Identification (FR5)")
    add_body("The system shall execute pure mathematical algorithms to calculate weighted coverage, curriculum gaps, and detect critical blindspots.", "Introduction: ")
    add_bullet("Active industry roles, weighted skills list, and topic-to-skill mappings.", "Inputs: ")
    add_bullet("For each skill, determine max topic coverage: Coverage(S_i) = max(TopicCoverage_i,j). Compute Weighted Coverage = [Sum(w_i * Coverage(S_i))] / [Sum(w_i)]. Net Gap = 100% - Weighted Coverage. Flag Blindspot if w_i >= 4 and Coverage(S_i) < 60%.", "Processing: ")
    add_bullet("Aggregated percentage scores, deficit skill rankings, and prioritized Board of Studies (BoS) revision agenda.", "Outputs: ")
    add_bullet("If a role has zero skills, return 0% coverage without dividing by zero. Default unmapped skills to 0% coverage.", "Error Handling: ")

    # FR6
    add_h3("3.2.6 Interactive Visual Analytics Dashboard (FR6)")
    add_body("The system shall render multi-dimensional visual charts illustrating curriculum alignment across all evaluated industry profiles.", "Introduction: ")
    add_bullet("Aggregated mathematical gap metrics from lib/calculations.js.", "Inputs: ")
    add_bullet("Transform metrics into Recharts SVG datasets: 1) Multi-axis Radar chart (Role Coverage Alignment), 2) Deficit Bar chart (Top Skill Gaps), 3) Coverage distribution gauges.", "Processing: ")
    add_bullet("Interactive SVG charts with tooltips, legend toggles, and responsive dimensions.", "Outputs: ")
    add_bullet("Render empty-state placeholders with guidance text if no syllabus data is cataloged.", "Error Handling: ")

    # FR7
    add_h3("3.2.7 Accreditation Dossier & BoS Formal Export Engine (FR7)")
    add_body("The system shall generate accreditation documentation formatted for NBA Criterion 2 and NAAC Sub-criterion 1.1 compliance.", "Introduction: ")
    add_bullet("Evaluated course catalogue, skill gap analytics, and faculty institutional metadata.", "Inputs: ")
    add_bullet("1) Generate structured CSV with proper comma escaping and MIME type text/csv. 2) Format formal HTML dossier with institutional crest, department metadata, course summary tables, and BoS action items.", "Processing: ")
    add_bullet("Instant browser file download for CSV dossiers and window.print() invocation for physical print / PDF generation.", "Outputs: ")
    add_bullet("Handle browser popup blocking gracefully by providing fallback download triggers.", "Error Handling: ")

    # FR8
    add_h3("3.2.8 Institutional Workspace Reset & Approved Syllabus Seeding (FR8)")
    add_body("The system shall provide a safe mechanism to seed new faculty workspaces with standard B.Tech CSE model syllabuses.", "Introduction: ")
    add_bullet("Faculty user confirmation prompt.", "Inputs: ")
    add_bullet("Check if workspace already holds data. If reset is confirmed, batch-write approved B.Tech CSE courses (CS201 Data Structures, CS202 DBMS, CS203 OS, CS301 Networks, CS302 Software Eng, CS303 Web Eng, CS401 AI, CS402 ML) and industry benchmark roles to Firestore.", "Processing: ")
    add_bullet("Fully populated workspace with 8 courses, 32 syllabus units, 5 industry roles, 24 skills, and 27 calibrated mappings.", "Outputs: ")
    add_bullet("Require two-step confirmation before wiping existing records; perform batch operations atomically.", "Error Handling: ")

    add_h2("3.5 Non-Functional Requirements")

    add_h3("3.5.1 Performance")
    add_bullet("The initial page load time (First Contentful Paint) shall not exceed 1.5 seconds on a standard 4G broadband connection, enabled by edge-cached static assets.", "Page Load: ")
    add_bullet("The mathematical gap analysis calculation for 100 courses and 500 mappings shall execute in less than 50 milliseconds in the browser.", "Calculation Speed: ")
    add_bullet("All Recharts SVG chart interactions, hover tooltips, and tab transitions shall maintain a frame rate of at least 60 FPS (<=16ms per frame).", "Chart Responsiveness: ")

    add_h3("3.5.2 Reliability")
    add_bullet("The system shall achieve 99.95% operational uptime backed by Google Cloud Firestore and Firebase Hosting SLA.", "Uptime: ")
    add_bullet("Mean Time Between Failures (MTBF) shall exceed 90 days. Zero data loss during network disconnection due to client-side optimistic caching.", "MTBF: ")

    add_h3("3.5.3 Availability")
    add_bullet("The application shall be available 24 hours a day, 7 days a week, 365 days a year worldwide through Google's multi-region CDN edge points of presence.", "Availability: ")

    add_h3("3.5.4 Security")
    add_bullet("All incoming and outgoing traffic shall be encrypted using TLS 1.3 over HTTPS with HTTP Strict Transport Security (HSTS) headers.", "Transport Security: ")
    add_bullet("Database access shall be governed strictly by Cloud Firestore Security Rules: request.auth.uid == userId. Cross-tenant access is rejected at the database kernel.", "Access Control: ")
    add_bullet("Zero client-side secrets or private API credentials; only public Firebase Web SDK keys are included in client bundles.", "Credential Protection: ")

    add_h3("3.5.5 Maintainability")
    add_bullet("Source code follows modular Next.js 14 conventions: pure logic isolated in lib/calculations.js, database transactions in lib/firestore.js, and presentation components in components/.", "Modularity: ")
    add_bullet("Codebase complies with ESLint and React hooks best practices with zero circular dependencies.", "Code Quality: ")

    add_h3("3.5.6 Portability")
    add_bullet("The application runs without platform-specific modification across Windows, macOS, Linux, iOS, and Android web browsers.", "Cross-Platform: ")

    add_h2("3.7 Design Constraints")
    add_bullet("The entire application must operate strictly on the Firebase Spark Free Tier without requiring paid Cloud Functions or MongoDB instances.", "1. Free Tier Quotas: ")
    add_bullet("Application must compile cleanly to static HTML/CSS/JS via 'npm run build' with zero server-side Node.js dependencies.", "2. Static Export: ")

    add_h2("3.9 Other Requirements")
    add_bullet("All user interface controls, color contrasts, and typography comply with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.", "Accessibility: ")
    add_bullet("The accreditation dossier output format strictly adheres to NBA Self Assessment Report (SAR) Criterion 2 document layout standards.", "Institutional Compliance: ")

    doc.add_page_break()

    # ==================== 4. ANALYSIS MODELS ====================
    add_h1("4. ANALYSIS MODELS")
    add_body("Analysis models provide structured graphical representations of how data flows, transforms, and persists throughout the SkillBridge application.")

    add_h2("4.1 Data Flow Diagrams (DFD)")

    add_h3("4.1.1 Level 0 DFD (Context Diagram)")
    add_body("The Context Diagram (Level 0 DFD) defines the operational boundary of the SkillBridge system, showing all external entities and high-level data streams entering and exiting the platform.")
    
    dfd0_text = (
        "+-----------------------------------------------------------------------------------+\n"
        "|                             LEVEL 0 DFD: CONTEXT DIAGRAM                          |\n"
        "+-----------------------------------------------------------------------------------+\n"
        "\n"
        "      +--------------------------------+       +--------------------------------+\n"
        "      |   FACULTY COURSE COORDINATOR   |       |     GOOGLE IDENTITY SERVICE    |\n"
        "      |   / BoS CURRICULUM COMMITTEE   |       |       (Firebase Auth SSO)      |\n"
        "      +--------------------------------+       +--------------------------------+\n"
        "               |              ^                         |              ^\n"
        "       Syllabus|              |Analytics &      OAuth ID|              |Auth\n"
        "       Data &  |              |Accreditation    Token & |              |Request\n"
        "       Mappings|              |Dossiers         Profile |              |\n"
        "               v              |                         v              |\n"
        "      +-----------------------------------------------------------------+\n"
        "      |                                                                 |\n"
        "      |                    0.0 SKILLBRIDGE SYSTEM                       |\n"
        "      |       (Curriculum-to-Industry Skill Gap Analytics Platform)     |\n"
        "      |                                                                 |\n"
        "      +-----------------------------------------------------------------+\n"
        "               |              ^                         |\n"
        "       User UID|              |Encrypted Course,        |Formal Accreditation\n"
        "       Scoped  |              |Role & Skill             |Self-Study Audit\n"
        "       Writes  |              |Documents                |Reports (SAR)\n"
        "               v              |                         v\n"
        "      +--------------------------------+       +--------------------------------+\n"
        "      |         CLOUD FIRESTORE        |       |      ACCREDITATION REVIEW      |\n"
        "      |    (User-Isolated Workspace)   |       |      BOARDS (NBA / NAAC)       |\n"
        "      +--------------------------------+       +--------------------------------+\n"
    )
    add_code_block(dfd0_text)

    add_body("Narrative Description of Level 0 DFD:", bold_prefix="Process Flow: ")
    add_bullet("The Faculty Course Coordinator provides institutional Google credentials to initiate single sign-on authentication.", "1. Authentication: ")
    add_bullet("Google Identity Service validates credentials and returns an encrypted OAuth token and user profile object.", "2. Identity Token Exchange: ")
    add_bullet("The faculty member inputs academic syllabus records (programs, courses, modules) and establishes depth mappings against industry competencies.", "3. Curriculum Ingestion: ")
    add_bullet("The SkillBridge system stores and reads records strictly isolated under users/{uid}/ in Cloud Firestore.", "4. Persistent Storage: ")
    add_bullet("The system processes these inputs and outputs visual gap charts, BoS revision agendas, and accreditation dossiers to Faculty and External Review Boards.", "5. Analytics Dispatch: ")

    add_h3("4.1.2 Level 1 DFD (Subsystem Decomposition)")
    add_body("The Level 1 DFD decomposes the SkillBridge system into five interconnected core subsystems and persistent Firestore data stores.")
    
    dfd1_text = (
        "+-----------------------------------------------------------------------------------+\n"
        "|                    LEVEL 1 DFD: SUBSYSTEM FUNCTIONAL DECOMPOSITION                |\n"
        "+-----------------------------------------------------------------------------------+\n"
        "\n"
        "   +--------------+\n"
        "   | Faculty User |---+ (Google SSO Login)\n"
        "   +--------------+   | \n"
        "                      v\n"
        "         +--------------------------+     Auth UID      +--------------------------+\n"
        "         | 1.0 Authentication &     |------------------>| D1: User Profile Store   |\n"
        "         | Session Management       |                   | (users/{uid}/profile)    |\n"
        "         +--------------------------+                   +--------------------------+\n"
        "                      |\n"
        "         +------------+------------+\n"
        "         |                         |\n"
        "         v                         v\n"
        "   +-------------------+     +-------------------+\n"
        "   | 2.0 Curriculum    |     | 3.0 Industry      |\n"
        "   | Catalog Manager   |     | Benchmark Manager |\n"
        "   +-------------------+     +-------------------+\n"
        "         |                         |\n"
        "         v                         v\n"
        "   +-------------------+     +-------------------+\n"
        "   | D2: Courses/Topics|     | D3: Roles/Skills  |\n"
        "   | (subjects/topics) |     | (roles/skills)    |\n"
        "   +-------------------+     +-------------------+\n"
        "         |                         |\n"
        "         +------------+------------+\n"
        "                      |\n"
        "                      v\n"
        "         +--------------------------+     Mappings      +--------------------------+\n"
        "         | 4.0 OBE Depth Mapping &  |------------------>| D4: Skill Mappings Store |\n"
        "         | Gap Calculation Engine   |<------------------| (skillMappings)          |\n"
        "         +--------------------------+                   +--------------------------+\n"
        "                      |\n"
        "                      | [Computed Coverage %, Gaps, Blindspots]\n"
        "                      v\n"
        "         +--------------------------+\n"
        "         | 5.0 Analytics Dashboard  |---> [Interactive SVG Radar & Bar Charts]\n"
        "         | & Accreditation Exporter |---> [NBA SAR Criterion 2 Print Dossiers]\n"
        "         +--------------------------+---> [Exportable Accreditation CSVs]\n"
    )
    add_code_block(dfd1_text)

    add_body("Subsystem Responsibilities:", bold_prefix="Component Functions: ")
    add_bullet("Validates user identity, provisions the Firestore profile document, and monitors real-time session tokens.", "Process 1.0 (Authentication): ")
    add_bullet("Handles CRUD operations for academic programs, course modules, L-T-P credit weights, and syllabus topics.", "Process 2.0 (Curriculum Manager): ")
    add_bullet("Maintains technical job profiles and competency matrices weighted by industrial relevance.", "Process 3.0 (Industry Benchmarks): ")
    add_bullet("Links syllabus topics to skills with Bloom's Taxonomy tiers, and executes mathematical deficit calculations.", "Process 4.0 (OBE Gap Engine): ")
    add_bullet("Renders real-time visual dashboards and generates formal accreditation audit files.", "Process 5.0 (Visualization & Export): ")

    add_h3("4.1.3 Level 2 DFD (Decomposition of Gap Calculation & Analysis Engine)")
    add_body("The Level 2 DFD details the mathematical internal data transformations inside Process 4.0 (OBE Depth Mapping & Gap Calculation Engine).")

    dfd2_text = (
        "+-----------------------------------------------------------------------------------+\n"
        "|           LEVEL 2 DFD: PROCESS 4.0 (GAP CALCULATION ENGINE DECOMPOSITION)         |\n"
        "+-----------------------------------------------------------------------------------+\n"
        "\n"
        "  Syllabus Topics (D2)             Mapped Skills (D4)            Industry Skills (D3)\n"
        "          |                                |                                |\n"
        "          +-----------------------+--------+                                |\n"
        "                                  |\n"
        "                                  v\n"
        "                   +------------------------------+\n"
        "                   | 4.1 Topic-Skill Best Match   |\n"
        "                   | Resolution Algorithm         |\n"
        "                   | Coverage(Si) = max(TopicCov) |\n"
        "                   +------------------------------+\n"
        "                                  |\n"
        "                                  | [Resolved Best Skill Coverage %]\n"
        "                                  v\n"
        "                   +------------------------------+   Importance Weights (w_i)\n"
        "                   | 4.2 Weighted Role Coverage   |<--------------------------+\n"
        "                   | Aggregation:                 |\n"
        "                   | Sum(w_i * Cov) / Sum(w_i)    |\n"
        "                   +------------------------------+\n"
        "                                  |\n"
        "                                  | [Role Coverage %]\n"
        "                                  v\n"
        "                   +------------------------------+\n"
        "                   | 4.3 Net Skill Gap Derivation |\n"
        "                   | Gap % = 100% - Coverage %    |\n"
        "                   +------------------------------+\n"
        "                                  |\n"
        "                                  v\n"
        "                   +------------------------------+\n"
        "                   | 4.4 Urgent Blindspot Filter  |\n"
        "                   | (w_i >= 4 AND Cov < 60%)     |\n"
        "                   +------------------------------+\n"
        "                                  |\n"
        "                                  v\n"
        "         [Output: Priority BoS Revision Agenda & Radar Chart Dataset]\n"
    )
    add_code_block(dfd2_text)

    add_h3("4.1.4 Cloud Firestore Data Dictionary & Schema Model")
    add_body("All data entities are stored in Google Cloud Firestore under strictly scoped subcollections per user:")

    schema_data = [
        ("users/{uid}/profile/main", "Faculty Profile", "uid, email, displayName, photoURL, department, designation, createdAt, lastLogin"),
        ("users/{uid}/programs/{id}", "Academic Program", "id, name (e.g. B.Tech CSE), code, department, regulation (R22), createdAt"),
        ("users/{uid}/subjects/{id}", "Course / Subject", "id, code (CS201), name, programId, semester (1-8), credits, lectures, tutorials, practicals"),
        ("users/{uid}/topics/{id}", "Syllabus Unit / Topic", "id, subjectId, unitNumber (1-5), name, description, contactHours, courseOutcomes"),
        ("users/{uid}/industryRoles/{id}", "Benchmark Tech Role", "id, title (Full Stack Dev), category, description, requiredSkillIds, createdAt"),
        ("users/{uid}/industrySkills/{id}", "Industry Competency", "id, name (React.js), category, description, weight (1-5), roleIds"),
        ("users/{uid}/skillMappings/{id}", "Topic-to-Skill Link", "id, topicId, skillId, coverageLevel (25, 60, 100), bloomLevel, notes, updatedAt"),
        ("users/{uid}/appMeta/workspace", "Workspace Meta", "id, initialized, seededVersion, courseCount, lastAuditDate")
    ]

    t_schema = doc.add_table(rows=len(schema_data)+1, cols=3)
    t_schema.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_schema)

    for i, h in enumerate(["Firestore Document Path", "Entity Name", "Attributes / Schema Fields"]):
        c = t_schema.rows[0].cells[i]
        set_cell_background(c, "0F172A")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]; p.paragraph_format.space_before = Pt(0); p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h); r.font.name = "Calibri"; r.font.size = Pt(9.5); r.font.bold = True; r.font.color.rgb = RGBColor(255, 255, 255)

    for idx, (path, name, fields) in enumerate(schema_data):
        row = t_schema.rows[idx+1]
        c0, c1, c2 = row.cells[0], row.cells[1], row.cells[2]
        c0.width = Inches(2.3); c1.width = Inches(1.5); c2.width = Inches(2.7)
        bg = "FFFFFF" if idx % 2 == 0 else "F8FAFC"
        for c in (c0, c1, c2):
            set_cell_background(c, bg)
            set_cell_margins(c, top=60, bottom=60, left=100, right=100)
            c.paragraphs[0].paragraph_format.space_before = Pt(0); c.paragraphs[0].paragraph_format.space_after = Pt(0)
        
        r0 = c0.paragraphs[0].add_run(path)
        r0.font.name = "Courier New"; r0.font.size = Pt(8.5); r0.font.bold = True; r0.font.color.rgb = NAVY

        r1 = c1.paragraphs[0].add_run(name)
        r1.font.name = "Calibri"; r1.font.size = Pt(9); r1.font.bold = True; r1.font.color.rgb = SLATE

        r2 = c2.paragraphs[0].add_run(fields)
        r2.font.name = "Calibri"; r2.font.size = Pt(8.5); r2.font.color.rgb = SLATE

    doc.add_page_break()

    # ==================== 5. GITHUB LINK ====================
    add_h1("5. GITHUB LINK")
    add_body("The complete, version-controlled source code repository for the SkillBridge Academic Analytics Platform is publicly hosted and maintained on GitHub:")

    p_git = doc.add_paragraph()
    p_git.paragraph_format.space_before = Pt(8)
    p_git.paragraph_format.space_after = Pt(12)
    p_git.paragraph_format.left_indent = Inches(0.2)
    add_hyperlink(p_git, "https://github.com/amitmokhriya/Skill-Bridge.git", "https://github.com/amitmokhriya/Skill-Bridge.git", color="1D4ED8", underline=True)

    add_body("Repository Architecture & Version Control Specifications:", bold_prefix="Repository Overview: ")
    add_bullet("https://github.com/amitmokhriya/Skill-Bridge.git", "Primary Remote URL: ")
    add_bullet("main (Production Release branch)", "Active Branch: ")
    add_bullet("Next.js 14 App Router, React 18, Tailwind CSS, Firebase Web SDK v10, Recharts, Lucide React.", "Core Technology Stack: ")
    add_bullet("Pure client-side static compilation ('output: export') into out/ directory for zero-server hosting.", "Build Pipeline: ")
    add_bullet("Excludes all private environment keys (.env.local, .env), node_modules, and build caches.", "Security & .gitignore Policy: ")
    add_bullet("Educational Open-Source Capstone (MIT License).", "Licensing: ")

    add_body("Key Repository File Map:", bold_prefix="Project Structure: ")
    add_bullet("Next.js App Router entry points (/login, /dashboard, /curriculum, /industry-roles, /industry-skills, /skill-mapping, /gap-analysis, /reports, /settings, /profile).", "app/ Directory: ")
    add_bullet("Shared UI elements (StatCard, Badge, Modal, EmptyState, ThemeToggle, Toast) and layouts (Sidebar, DashboardHeader, ProtectedRoute).", "components/ Directory: ")
    add_bullet("Global React Context providers for Google Authentication and persistent Dark/Light Theme.", "context/ Directory: ")
    add_bullet("Custom React hooks for real-time Firestore CRUD, workspace seeding, and live state.", "hooks/ Directory: ")
    add_bullet("Pure mathematical gap analysis formulas (calculations.js), Firebase initialization (firebase.js), and Firestore subcollection helpers (firestore.js).", "lib/ Directory: ")
    add_bullet("Defines strict per-user database access constraints (request.auth.uid == userId).", "firestore.rules: ")

    doc.add_page_break()

    # ==================== 6. DEPLOYED LINK ====================
    add_h1("6. DEPLOYED LINK")
    add_body("The production instance of SkillBridge is deployed live on Google Firebase Hosting infrastructure:")

    p_dep = doc.add_paragraph()
    p_dep.paragraph_format.space_before = Pt(8)
    p_dep.paragraph_format.space_after = Pt(12)
    p_dep.paragraph_format.left_indent = Inches(0.2)
    add_hyperlink(p_dep, "https://skillbridge-6d9cf.web.app", "https://skillbridge-6d9cf.web.app", color="1D4ED8", underline=True)

    add_body("Production Deployment Specifications:", bold_prefix="Cloud Infrastructure: ")
    add_bullet("https://skillbridge-6d9cf.web.app (Alternative domain: https://skillbridge-6d9cf.firebaseapp.com)", "Production Web URL: ")
    add_bullet("skillbridge-6d9cf", "Firebase Project ID: ")
    add_bullet("Firebase Hosting (Spark Free Tier) backed by Google Cloud global CDN Edge POPs.", "Hosting Tier: ")
    add_bullet("Google Identity Toolkit OAuth 2.0 PKCE flow with authorized domain bindings.", "Authentication Service: ")
    add_bullet("Cloud Firestore (Multi-region: us-central1 / asia-south1).", "Database Engine: ")
    add_bullet("HTTP/1.1 200 OK verified across root (/), login (/login/), and dashboard (/dashboard/) routes.", "Live Verification Status: ")
    add_bullet("Strict-Transport-Security (HSTS), TLS 1.3, X-Content-Type-Options: nosniff, Content-Type: text/html; charset=utf-8.", "Security Headers: ")

    add_callout(
        "To evaluate the live system, navigate to https://skillbridge-6d9cf.web.app, select 'Sign in with University Google Account', and access your secure, pre-seeded B.Tech Computer Science curriculum workspace.",
        bold_title="FACULTY & EVALUATOR ACCESS NOTE"
    )

    doc.save(filename)
    print(f"Document successfully created and saved at: {filename}")

if __name__ == "__main__":
    create_srs_document()
