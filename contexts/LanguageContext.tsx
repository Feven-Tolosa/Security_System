"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SupportedLanguage = "en" | "am";

type TranslationDictionary = Record<string, string>;

type TranslationsMap = Record<SupportedLanguage, TranslationDictionary>;

const TRANSLATIONS: TranslationsMap = {
  en: {
    nav_gasha: "Gasha",
    nav_nisir: "Nisir",
    nav_enyuma: "Enyuma IAM",
    nav_code_protection: "Code Protection",
    nav_biometrics: "Biometrics",
    nav_contact_us: "Contact us",
    nav_login: "Login",
    nav_logout: "Logout",
    nav_role_admin: "Admin",
    nav_role_manager: "Manager",
    aria_toggle_theme: "Toggle theme",
    hero_secure_your: "Secure Your",
    hero_systems_with: "Systems with",
    hero_advanced_solutions: "Advanced Solutions",
    hero_typing_trust_1: "Trust our ",
    hero_typing_trust_2: "homegrown solutions ",
    hero_typing_trust_3: "to secure your systems!",
    footer_company_name: "CyberSecure",
    footer_company_tagline:
      "Building resilient digital ecosystems with AI-powered defense and biometric identity protection.",
    footer_insa_name: "Information Network Security Agency",
    footer_quick_links: "Quick Links",
    footer_products: "Products",
    footer_solutions: "Solutions",
    footer_contact: "Contact",
    footer_privacy: "Privacy Policy",
    footer_connect: "Connect",
    footer_location: "Addis Ababa, Ethiopia",
    footer_phone: "+251 123 456 789",
    footer_email: "info@insa.gov.et",
    footer_social_twitter: "Twitter",
    footer_social_linkedin: "LinkedIn",
    footer_copyright: "SecureSystem. All rights reserved.",
    contact_title: "We’d love to hear from you",
    contact_subtitle:
      "Reach out to us and let’s explore how we can help secure your digital future.",
    contact_placeholder_email: "Your email",
    contact_send: "Send",
    contact_alert_fill_email: "Please enter your email before sending.",
    admin_settings: "Settings",
    admin_logout: "Logout",
    admin_dashboard: "Dashboard",
    admin_requests: "Requests",
    admin_downloads: "Downloads",
    admin_reports: "Reports",
    admin_settings_nav: "Settings",
    common_download: "Download",
    common_send_request: "Send Request",
    common_cancel: "Cancel",
    common_submit_request: "Submit Request",
    common_submitting: "Submitting...",
    contact_status_success: "Message sent successfully!",
    contact_status_error: "Failed to send message. Please try again.",
    cp_title: "Cyber Defense Suite",
    cp_show_product: "show product",
    biometrics_title: "Biometric Identity Protection",
    nisir_heading: "SIEM",
    enyuma_title: "Enyuma IAM",
    alert_rate_limit: "Too many requests. Please try again in a minute.",
    alert_request_thank_you:
      "Thank you for your request! We'll get back to you soon.",
    alert_request_error:
      "An error occurred while submitting your request. Please try again later.",
    request_title_prefix: "Request",
    cp_para_1:
      "Secure your cyber estate while building a resilient, future-ready business. In today’s rapidly evolving digital landscape, cyber defense must continuously adapt to new vulnerabilities and attack vectors.",
    cp_para_2:
      "The TCS Cyber Defense Suite offers integrated services tailored to modern enterprise needs. It provides enhanced visibility, protection, detection, response, recovery, and governance — all aligned with industry standards like NIST CSF and CIS.",
    cp_para_3:
      "Infused with AI and built for quantum-readiness, our platform empowers CISOs and CIOs to manage cyber risk, ensure compliance, and strengthen resilience across IT-OT workloads.",
    bio_para_1:
      "Safeguard user identities with advanced biometric authentication. Our platform supports fingerprint, facial recognition, iris scan, and behavioral biometrics.",
    bio_para_2:
      "Built for zero-trust environments, it ensures secure access across devices and locations, reducing reliance on passwords and minimizing identity fraud.",
    bio_para_3:
      "Seamlessly integrates with IAM systems and supports compliance with GDPR, HIPAA, and other global standards.",
    gasha_av_title: "Gasha Antivirus",
    gasha_av_desc:
      "A robust and intelligent defense system designed to safeguard your digital world from viruses, malware, ransomware, and evolving cyber threats. With cutting-edge technology, real-time protection, and advanced threat detection, it ensures your data, privacy, and devices stay secure.",
    gasha_av_feat_1:
      "Real-Time Protection: Keeps desktops, laptops, downloads, and external devices safe.",
    gasha_av_feat_2:
      "AI-Powered Detection: Protects against known and unknown threats using artificial intelligence.",
    gasha_av_feat_3:
      "Up-to-Date Database: Regular virus definition updates to counter emerging threats.",
    gasha_av_feat_4:
      "Tamper Protection: Secures your Windows registry from unauthorized changes.",
    gasha_vpn_title: "Gasha VPN",
    gasha_vpn_p1:
      "Gasha VPN is a secure tunneling solution designed to safeguard your digital footprint. It encrypts your internet traffic, masks your IP address, and ensures complete anonymity while browsing. Whether you're accessing public Wi-Fi or working remotely, Gasha VPN provides a fortified shield against cyber threats and surveillance.",
    gasha_vpn_p2:
      "Our advanced protocols protect you from data interception, ISP tracking, and geo-restrictions. With Gasha VPN, you can stream content, access restricted websites, and communicate freely—without compromising your privacy. It's the ultimate tool for digital freedom in an increasingly monitored world.",
    gasha_vpn_p3:
      "Powered by high-speed servers and military-grade encryption, Gasha VPN delivers a seamless experience across all devices. Enjoy lightning-fast connections, zero-logging policies, and intuitive controls that make security effortless. Whether you're a casual user or a cybersecurity professional, Gasha VPN adapts to your needs with precision and reliability.",
    gasha_waf_title: "Gasha WAF",
    gasha_waf_p1:
      "Gasha Web Application Firewall (WAF) is a security solution that protects web applications by filtering and monitoring HTTP traffic. It acts as a shield between your web server and the internet.",
    gasha_waf_p2:
      "It defends against common attacks such as cross-site scripting (XSS), SQL injection, and other OWASP Top 10 threats. Gasha WAF intelligently blocks malicious requests before they reach your application.",
    gasha_waf_p3:
      "With real-time monitoring and adaptive threat detection, Gasha WAF ensures your web services remain secure, reliable, and compliant with modern cybersecurity standards.",
    nisir_p1:
      "Nisir SIEM is a next-generation security information and event management platform designed to detect, analyze, and respond to threats in real time. It aggregates logs, monitors network activity, and provides actionable insights to security teams.",
    nisir_p2:
      "With advanced correlation rules, machine learning, and customizable dashboards, Nisir SIEM empowers organizations to stay ahead of evolving cyber threats. It integrates seamlessly with existing infrastructure and scales effortlessly across environments.",
    nisir_p3:
      "Built with a focus on visibility and control, Nisir SIEM offers intuitive alerting, forensic analysis, and compliance reporting. Whether you're defending a small business or a national enterprise, Nisir SIEM adapts to your security needs with precision.",
    enyuma_p1:
      "Enyuma is a powerful threat intelligence engine designed to correlate external threat feeds with internal activity.",
    enyuma_p2:
      "It enhances visibility into emerging risks, enabling proactive defense strategies and faster incident response.",
    enyuma_p3:
      "With real-time enrichment and contextual analysis, Enyuma transforms raw data into actionable intelligence for security teams.",
    form_basic_info: "Basic Information",
    form_company_details: "Company Details",
    form_technical_details: "Technical Details",
    form_additional_info: "Additional Information",
    form_full_name: "Full Name",
    form_email: "Email",
    form_company: "Company",
    form_company_name: "Company Name",
    form_total_agentless: "Total Agentless",
    form_total_computers: "Total Computers",
    form_contact_name: "Contact Person",
    form_contact_phone: "Contact Phone",
    form_website: "Website",
    form_office_number: "Office Number",
    form_job_title: "Job Title",
    form_department: "Department",
    form_operating_system: "Operating System",
    form_os_architecture: "OS Architecture",
    form_message: "Message",
    form_os_windows_placeholder: "e.g., Windows 10, 11",
    form_os_linux_placeholder: "e.g., Ubuntu 20.04, CentOS 7",
    form_message_placeholder: "Tell us about your needs...",
    form_select_architecture: "Select architecture",
    option_windows: "Windows",
    option_mac: "Mac",
    option_linux: "Linux",
    option_32_bit: "32-bit",
    option_64_bit: "64-bit",
    common_view_page: "View Page",
    admin_dashboard_title: "Admin Dashboard",
    admin_dashboard_subtitle:
      "Manage users, requests, and downloads of the security system",
    admin_total_users: "Total Users",
    admin_app_downloads: "App Downloads",
    admin_pending_requests: "Pending Requests",
    admin_user_requests: "User Requests",
    admin_no_pending_requests: "No pending requests",
    admin_recent_activity: "Recent Activity",
    admin_downloads_title: "Downloads",
    table_file: "File",
    table_size: "Size",
    table_downloads: "Downloads",
    table_last_download: "Last Download",
    table_empty_downloads: "No downloads recorded.",
    admin_settings_title: "Admin Settings",
    admin_tab_profile: "Profile",
    admin_tab_security: "Security",
    admin_tab_system: "System",
    admin_profile_settings: "Profile Settings",
    admin_profile_photo: "Profile Photo",
    admin_profile_photo_hint:
      "JPG, PNG or GIF. Max 5MB. Changes apply immediately.",
    admin_member_since: "Member Since",
    admin_last_login: "Last Login",
    admin_save_profile: "Save Profile",
    admin_saving: "Saving...",
    admin_security_settings: "Security Settings",
    admin_reset_password: "Reset Password",
    admin_password_management: "Password Management",
    admin_current_password: "Current Password",
    admin_default_password: "Default password:",
    admin_new_password: "New Password",
    admin_password_strength: "Password Strength:",
    admin_confirm_new_password: "Confirm New Password",
    admin_passwords_match: "✓ Passwords match",
    admin_passwords_do_not_match: "✗ Passwords do not match",
    admin_last_changed: "Last Changed",
    admin_security_features: "Security Features",
    admin_two_factor_auth: "Two-Factor Authentication",
    admin_login_alerts: "Login Alerts",
    admin_security_status: "Security Status",
    admin_2fa_status: "2FA Status:",
    admin_enabled: "Enabled",
    admin_disabled: "Disabled",
    admin_active: "Active",
    admin_inactive: "Inactive",
    admin_update_security_settings: "Update Security Settings",
    admin_system_preferences: "System Preferences",
    admin_theme: "Theme",
    admin_automatic_backups: "Automatic Backups",
    admin_auto_backup_hint: "Automatically backup system data",
    admin_backup_frequency: "Backup Frequency",
    admin_save_preferences: "Save Preferences",
    option_dark: "Dark",
    option_light: "Light",
    option_system_default: "System Default",
    // Enyuma/CodePro component CTAs
    common_view_page: "View Page",
    // Reports page
    reports_dashboard_title: "Reports & Analytics Dashboard",
    total_downloads: "Total Downloads",
    all_time_downloads: "All time downloads",
    total_requests_label: "Total Requests",
    all_time_requests: "All time requests",
    approval_rate_label: "Approval Rate",
    requests_approved: "Requests approved",
    pending_requests_label: "Pending Requests",
    awaiting_review: "Awaiting review",
    monthly_activity: "Monthly Activity",
    request_status_distribution: "Request Status Distribution",
    weekly_trends: "Weekly Trends",
    download_distribution: "Download Distribution",
    product_performance: "Product Performance",
    data_summary: "Data Summary",
    downloads_information: "Downloads Information",
    most_downloaded: "Most downloaded",
    last_updated: "Last updated",
    requests_information: "Requests Information",
    approval_rate_summary: "Approval rate",
    pending_reviews: "Pending reviews",
    total_products: "Total products",
    legend_downloads: "Downloads",
    legend_requests: "Requests",
    // Admin requests page
    security_requests_dashboard: "Security Requests Dashboard",
    btn_approve: "Approve",
    btn_reject: "Reject",
    btn_pending: "Pending",
    btn_details: "Details",
    status_label: "Status",
    label_id: "ID",
    label_name: "Name",
    label_email: "Email",
    label_company: "Company",
    label_type: "Type",
    label_date: "Date",
    request_details: "Request Details",
    btn_close: "Close",
    message_label: "Message",
    no_requests_found: "No requests found",
  },
  am: {
    nav_gasha: "ጋሻ",
    nav_nisir: "ንስር",
    nav_enyuma: "ኢኒዩማ አይኤኤም",
    nav_code_protection: "ኮድ ጥበቃ",
    nav_biometrics: "ባዮሜትሪክስ",
    nav_contact_us: "አግኙን",
    nav_login: "መግባት",
    nav_logout: "መውጣት",
    nav_role_admin: "አድሚን",
    nav_role_manager: "ማኔጀር",
    aria_toggle_theme: "ገጽታ መቀየሪያ",
    hero_secure_your: "አስተማማኝ አድርጉ",
    hero_systems_with: "ስርዓቶቻችሁን በ",
    hero_advanced_solutions: "የላቀ መፍትሄዎች",
    hero_typing_trust_1: "የእኛን ",
    hero_typing_trust_2: "አገር ውስጥ የተተከለ መፍትሄ ",
    hero_typing_trust_3: "ለስርዓቶቻችሁ ደህንነት!",
    footer_company_name: "CyberSecure",
    footer_company_tagline:
      "በኤ.አ. የተጎላበተ መከላከያ እና ባዮሜትሪክ መታወቂያ ጥበቃ ጋር ጠንካራ ዲጂታል ኢኮሲስተም መገንባት።",
    footer_insa_name: "የመረጃ አውታረ መረብ ደህንነት ኤጀንሲ",
    footer_quick_links: "ፈጣን አገናኞች",
    footer_products: "ምርቶች",
    footer_solutions: "መፍትሄዎች",
    footer_contact: "እናግኙን",
    footer_privacy: "የግላዊነት ፖሊሲ",
    footer_connect: "አገናኝ",
    footer_location: "አዲስ አበባ፣ ኢትዮጵያ",
    footer_phone: "+251 123 456 789",
    footer_email: "info@insa.gov.et",
    footer_social_twitter: "ትዊተር",
    footer_social_linkedin: "ሊንክድኢን",
    footer_copyright: "SecureSystem. መብቶች ሁሉ የተቆጠቡ ናቸው።",
    contact_title: "ከእናንተ መስማት እናወዳለን",
    contact_subtitle: "ያግኙን እና የዲጂታል ወደፊትዎን እንዴት እንደምንጠብቅ እንወስን።",
    contact_placeholder_email: "ኢሜይልዎ",
    contact_send: "ላክ",
    contact_alert_fill_email: "ከመላክዎ በፊት እባክዎን ኢሜይልዎን ያስገቡ።",
    admin_settings: "ቅንብሮች",
    admin_logout: "መውጣት",
    admin_dashboard: "ዳሽቦርድ",
    admin_requests: "ጥያቄዎች",
    admin_downloads: "አውርዶች",
    admin_reports: "ሪፖርቶች",
    admin_settings_nav: "ቅንብሮች",
    common_download: "አውርድ",
    common_send_request: "ጥያቄ ላክ",
    common_cancel: "ሰርዝ",
    common_submit_request: "ጥያቄ ላክ",
    common_submitting: "በመላክ ላይ...",
    contact_status_success: "መልዕክቱ ተሳክቷል!",
    contact_status_error: "መልዕክቱ አልተላከም። እባክዎን ደግሞ ይሞክሩ።",
    cp_title: "የሲበር መከላከያ ስቱይት",
    cp_show_product: "ምርቱን አሳይ",
    biometrics_title: "የባዮሜትሪክ መታወቂያ ጥበቃ",
    nisir_heading: "SIEM",
    enyuma_title: "ኢኒዩማ አይኤኤም",
    alert_rate_limit: "ብዙ ጥያቄዎች ተላኩ። እባክዎ ከጥቂት ጊዜ በኋላ ይሞክሩ።",
    alert_request_thank_you: "ለጥያቄዎ እናመሰግናለን! በቅርቡ እንመልስልዎታለን።",
    alert_request_error: "ጥያቄዎን በመላክ ላይ ስህተት ተፈጥሯል። እባክዎን ደግሞ ይሞክሩ።",
    request_title_prefix: "ጥያቄ",
    cp_para_1:
      "የሲበር ንብረትዎን በደህና በማድረግ ጠንካራ እና ወደፊት የተዘጋጀ ንግድ ይገንቡ። በዛሬው ፈጣን የሚለውጥ ዲጂታል አለም ውስጥ የሲበር መከላከያ ሁል ጊዜ ለአዳዲስ ችግኝነቶች እና ጥቃት መንገዶች መላመድ ያስፈልገዋል።",
    cp_para_2:
      "የTCS የሲበር መከላከያ ስቱይት ለዘመናዊ ድርጅቶች የተሰራ የተዋሃደ አገልግሎት ይሰጣል። ይህ የታየነት፣ ጥበቃ፣ መመርመር፣ መልስ መስጠት፣ መመለስ እና አስተዳደር ይጨምራል እና ከNIST CSF እና CIS ያሉ መስፈርቶች ጋር የተጣመረ ነው።",
    cp_para_3:
      "በኤ.አ. ተጎላብቶ እና ለኳንተም የተዘጋጀ የመሆኑ ምክንያት መድረካችን ለCISO እና CIO የሲበር ስጋትን እንዲቆጥቡ፣ ህጋዊ መስፈርቶችን እንዲፈጽሙ እና በIT-OT ውስጥ ጠንካራነትን እንዲጠናክሩ ይረዳቸዋል።",
    bio_para_1:
      "የተሻለ የባዮሜትሪክ ማረጋገጫ በመጠቀም የተጠቃሚ መለያዎችን አስተማማኝ ያድርጉ። መድረካችን ጣትማርክ፣ ፊት ማወቂያ፣ ዐይን ስካን እና ባህሪ ባዮሜትሪክስን ይደግፋል።",
    bio_para_2:
      "ለዘሮ-ታስት አካባቢዎች የተሠራ ስለሆነ በመሣሪያዎች እና ቦታዎች ላይ አስተማማኝ መዳረሻ ያረጋግጣል፣ በየይለፍ ቃል ላይ እገዳን ያሳነሳል እና የመለያ ማታለያን ያሳነሳል።",
    bio_para_3:
      "ከIAM ስርዓቶች ጋር በቀላሉ ይተዋወቃል እና ከGDPR፣ HIPAA እና ሌሎች ዓለም አቀፍ መመሪያዎች ጋር ስምምነት ይደግፋል።",
    gasha_av_title: "ጋሻ አንቲቫይረስ",
    gasha_av_desc:
      "በቫይረሶች፣ ማልዌር፣ ራንሰምዌር እና የሚያዳብሩ የሲበር አደጋዎች ላይ የሚከላከል ጠንካራ እና አስተዋፅኦ ያለው መከላከያ ስርዓት ነው። በዘመናዊ ቴክኖሎጂ፣ በሰዓታት የተመረመረ ጥበቃ እና በላቀ ማወቂያ ጋር የእርስዎን ውሂብ፣ ግላዊነት እና መሣሪያዎች ይጠብቃል።",
    gasha_av_feat_1: "በቀል ጊዜ ጥበቃ፦ ዴስክቶፕ፣ ላፕቶፕ፣ የማውረድ እቃዎች እና ውጭ መሣሪያዎችን ይጠብቃል።",
    gasha_av_feat_2: "በኤ.አ. የተጎላበተ ማወቂያ፦ የሚታወቁን እና ያልታወቁን አደጋዎችን ይከላከላል።",
    gasha_av_feat_3: "ዘመናዊ ዳታቤዝ፦ አዳዲስ አደጋዎችን ለመቆጣጠር በየጊዜው የቫይረስ መግለጫ ዝማኔ።",
    gasha_av_feat_4: "ቴምፐር መከላከያ፦ የWindows ሪጅስትሪዎን ከፈቃድ ውጭ ለውጦች ይጠብቃል።",
    gasha_vpn_title: "ጋሻ VPN",
    gasha_vpn_p1:
      "ጋሻ VPN የይነመረብ ትራፊክዎን በመመስረት እና አይፒ አድራሻዎን በመሸፈን ዲጂታል ምርጥ እግር እንዲኖርዎ የሚረዳ የጥበቃ መፍትሄ ነው።",
    gasha_vpn_p2: "የላቀ ፕሮቶኮሎቻችን ከመረጃ መጥፎ መያዝ፣ ከISP መከታተል እና ከጂኦ ገደቦች ይከላከላሉ።",
    gasha_vpn_p3:
      "በፍጥነት ከፍ ያለ አገልግሎት እና የሰማይ ደረጃ ማመስጠር ጋር በመሣሪያ ሁሉ ላይ ምቹ ተሞክሮ ይሰጣል።",
    gasha_waf_title: "ጋሻ WAF",
    gasha_waf_p1:
      "ጋሻ የድር መተግበሪያ ፋየርዎል (WAF) የHTTP ትራፊክን በመጣስ እና በመቆጣጠር ድር መተግበሪያዎችን የሚጠብቅ መፍትሄ ነው።",
    gasha_waf_p2: "ከXSS፣ SQL ኢንጀክሽን እና ከOWASP Top 10 አደጋዎች ይከላከላል።",
    gasha_waf_p3:
      "በቀል ጊዜ ክትትል እና ተስማሚ ስጋት ማወቂያ ጋር አገልግሎቶችዎ የሚጠበቁ እና የህግ መመሪያዎችን የሚፈጽሙ ይቆያሉ።",
    nisir_p1:
      "Nisir SIEM በቀል ጊዜ ስጋቶችን ለመገንዘብ፣ ለመተንተን እና ለመመለስ የተሠራ የቀላል መረጃ እና ክስተት አስተዳደር መድረክ ነው።",
    nisir_p2:
      "በላቀ የተዛማጅነት ደንብ፣ ማሽን ለርኒንግ እና በሚስማማ ዳሽቦርዶች ጋር ድርጅቶችን ከሚያዳብሩ የሲበር ስጋቶች በፊት እንዲገኙ ይረዳል።",
    nisir_p3:
      "በተግባር ታየ እና ቁጥጥር ላይ የተመሰረተ ስለሆነ ቀላል ማንቂያ፣ ፎሬንሲክስ እና የህጋዊ ሪፖርት ይሰጣል።",
    enyuma_p1:
      "ኢኒዩማ ውጫዊ አደጋ መረጃዎችን ከውስጣዊ እንቅስቃሴ ጋር የሚያያዝ ጠንካራ የአደጋ መረጃ መንቀሳቀስ ነው።",
    enyuma_p2: "በሚታወቀው ስጋት ላይ እይታን ያሳድጋል እና ፈጣን መልስ ስራዎችን ያበረታታል።",
    enyuma_p3:
      "በቀል ጊዜ ማባበር እና በአውድ ትንታኔ ጋር ኢኒዩማ ዝርዝር መረጃን ወደ እርስ ተሞክሮ የሚያስቀመጥ መረጃ ያደርጋል።",
    form_basic_info: "መሰረታዊ መረጃ",
    form_company_details: "የኩባንያ ዝርዝር",
    form_technical_details: "ቴክኒካዊ ዝርዝር",
    form_additional_info: "ተጨማሪ መረጃ",
    form_full_name: "ሙሉ ስም",
    form_email: "ኢሜይል",
    form_company: "ኩባንያ",
    form_company_name: "የኩባንያ ስም",
    form_total_agentless: "ጠቅላላ ኤጄንትሌስ",
    form_total_computers: "ጠቅላላ ኮምፒዩተሮች",
    form_contact_name: "የእውቂያ ስም",
    form_contact_phone: "የስልክ ቁጥር",
    form_website: "ድህረገፅ",
    form_office_number: "የቢሮ ቁጥር",
    form_job_title: "የስራ መደብ",
    form_department: "ክፍል",
    form_operating_system: "የኦፕሬቲንግ ሲስተም",
    form_os_architecture: "የኦስ አቋም",
    form_message: "መልዕክት",
    form_os_windows_placeholder: "ለምሳሌ፣ Windows 10, 11",
    form_os_linux_placeholder: "ለምሳሌ፣ Ubuntu 20.04, CentOS 7",
    form_message_placeholder: "ስለ ፍላጎቶት ይንገሩን...",
    form_select_architecture: "አቋም ይምረጡ",
    option_windows: "ዊንዶውስ",
    option_mac: "ማክ",
    option_linux: "ሊኑክስ",
    option_32_bit: "32-ቢት",
    option_64_bit: "64-ቢት",
    common_view_page: "ገጹን እይ",
    admin_dashboard_title: "የአስተዳዳሪ ዳሽቦርድ",
    admin_dashboard_subtitle: "የደህንነት ስርዓቱን ተጠቃሚዎች፣ ጥያቄዎች እና አውርዶች ያቀናብሩ",
    admin_total_users: "ጠቅላላ ተጠቃሚዎች",
    admin_app_downloads: "የመተግበሪያ አውርዶች",
    admin_pending_requests: "ለመፍታት ያሉ ጥያቄዎች",
    admin_user_requests: "የተጠቃሚ ጥያቄዎች",
    admin_no_pending_requests: "ምንም የሚጠብቁ ጥያቄዎች የሉም",
    admin_recent_activity: "የቅርብ ጊዜ እንቅስቃሴ",
    admin_downloads_title: "አውርዶች",
    table_file: "ፋይል",
    table_size: "መጠን",
    table_downloads: "አውርዶች",
    table_last_download: "መጨረሻ አውርድ",
    table_empty_downloads: "ምንም አውርዶች አልተመዘገቡም።",
    admin_settings_title: "የአስተዳዳሪ ቅንብሮች",
    admin_tab_profile: "ፕሮፋይል",
    admin_tab_security: "ደህንነት",
    admin_tab_system: "ሲስተም",
    admin_profile_settings: "የፕሮፋይል ቅንብሮች",
    admin_profile_photo: "የፕሮፋይል ፎቶ",
    admin_profile_photo_hint: "JPG, PNG ወይም GIF. ከ5MB በታች። ለውጦች ወዲያውኑ ይተገበራሉ።",
    admin_member_since: "አባል ጀምሮ",
    admin_last_login: "መጨረሻ መግቢያ",
    admin_save_profile: "ፕሮፋይል አስቀምጥ",
    admin_saving: "በማስቀመጥ ላይ...",
    admin_security_settings: "የደህንነት ቅንብሮች",
    admin_reset_password: "የይለፍ ቃል አድስ",
    admin_password_management: "የይለፍ ቃል አስተዳደር",
    admin_current_password: "የአሁኑ የይለፍ ቃል",
    admin_default_password: "ነባሪ የይለፍ ቃል:",
    admin_new_password: "አዲስ የይለፍ ቃል",
    admin_password_strength: "የይለፍ ቃል ኃይል:",
    admin_confirm_new_password: "አዲስ የይለፍ ቃል ያረጋግጡ",
    admin_passwords_match: "✓ የይለፍ ቃሎቹ ተመሳሳይ ናቸው",
    admin_passwords_do_not_match: "✗ የይለፍ ቃሎቹ አይመሳሰሉም",
    admin_last_changed: "መጨረሻ ተለወጠ",
    admin_security_features: "የደህንነት ባህሪያት",
    admin_two_factor_auth: "ሁለት እርምጃ ማረጋገጫ",
    admin_login_alerts: "የመግቢያ ማስጠንቀቂያዎች",
    admin_security_status: "የደህንነት ሁኔታ",
    admin_2fa_status: "የ2FA ሁኔታ:",
    admin_enabled: "ተችሏል",
    admin_disabled: "ተሰናክሏል",
    admin_active: "ንቁ",
    admin_inactive: "እንቅስቃሴ የለም",
    admin_update_security_settings: "የደህንነት ቅንብሮችን አዘምን",
    admin_system_preferences: "የሲስተም ምርጫዎች",
    admin_theme: "ገጽታ",
    admin_automatic_backups: "ራስ በራስ ቅጂዎች",
    admin_auto_backup_hint: "የሲስተም ውሂብ በራስ በራስ ይቀድ",
    admin_backup_frequency: "የቅጂ ድግግሞሽ",
    admin_save_preferences: "ምርጫዎችን አስቀምጥ",
    option_dark: "ጨለማ",
    option_light: "ብርሃን",
    option_system_default: "የሲስተም ነባሪ",
    common_view_page: "ገጹን እይ",
    reports_dashboard_title: "ሪፖርት እና ትንታኔ ዳሽቦርድ",
    total_downloads: "ጠቅላላ አውርዶች",
    all_time_downloads: "ሁሉንም ጊዜ አውርዶች",
    total_requests_label: "ጠቅላላ ጥያቄዎች",
    all_time_requests: "ሁሉንም ጊዜ ጥያቄዎች",
    approval_rate_label: "የማጽደቅ መጠን",
    requests_approved: "የተረጋገጡ ጥያቄዎች",
    pending_requests_label: "የሚጠብቁ ጥያቄዎች",
    awaiting_review: "የሚጠብቁ ግምገማዎች",
    monthly_activity: "ወርሃዊ እንቅስቃሴ",
    request_status_distribution: "የጥያቄ ሁኔታ ስርጭት",
    weekly_trends: "የሳምንት ዝናብ",
    download_distribution: "የአውርድ ስርጭት",
    product_performance: "የምርት አፈፃፀም",
    data_summary: "የውሂብ አጠቃላይ",
    downloads_information: "የአውርድ መረጃ",
    most_downloaded: "በጣም የተወረደው",
    last_updated: "መጨረሻ የተዘመነ",
    requests_information: "የጥያቄዎች መረጃ",
    approval_rate_summary: "የማጽደቅ መጠን",
    pending_reviews: "የሚጠብቁ ግምገማዎች",
    total_products: "ጠቅላላ ምርቶች",
    legend_downloads: "አውርዶች",
    legend_requests: "ጥያቄዎች",
    security_requests_dashboard: "የደህንነት ጥያቄዎች ዳሽቦርድ",
    btn_approve: "አጽድቅ",
    btn_reject: "አልቀር",
    btn_pending: "በመጠባበቅ ላይ",
    btn_details: "ዝርዝር",
    status_label: "ሁኔታ",
    label_id: "መለያ",
    label_name: "ስም",
    label_email: "ኢሜይል",
    label_company: "ኩባንያ",
    label_type: "አይነት",
    label_date: "ቀን",
    request_details: "የጥያቄ ዝርዝር",
    btn_close: "ዝጋ",
    message_label: "መልዕክት",
    no_requests_found: "ምንም ጥያቄ አልተገኘም",
  },
};

type LanguageContextValue = {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("secure-shield-language");
      if (stored === "en" || stored === "am") setLanguageState(stored);
    } catch {}
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("secure-shield-language", lang);
    } catch {}
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(((prev) => (prev === "en" ? "am" : "en")) as SupportedLanguage);
  }, [setLanguage]);

  const t = useCallback(
    (key: string): string => {
      const dict = TRANSLATIONS[language];
      return dict[key] ?? key;
    },
    [language]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, setLanguage, toggleLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
