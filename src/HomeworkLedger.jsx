import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BookOpen, Users, Calendar, Trophy, LogOut, Plus, Trash2, Check, X,
  User, Lock, GraduationCap, ClipboardList, BarChart3, ChevronLeft,
  ChevronRight, Pencil, Save, KeyRound, School, CheckCircle2,
  Circle, AlertCircle, Loader2, Layers, Languages,
  FileText, ZoomIn, ZoomOut, ArrowUp, ArrowDown, Youtube, Upload,
  RotateCcw, Video as VideoIcon, Menu, Image as ImageIcon, ListChecks
} from "lucide-react";
import { supabase } from "./supabaseClient";

// ---------- i18n ----------
const STRINGS = {
  mr: {
    appName: "जि.प.प्रा.शा. भांगापूर", appTagline: "रोजचा गृहपाठ, गुण आणि क्रमवारी",
    roleStudent: "विद्यार्थी", roleTeacher: "शिक्षक",
    userId: "युजर आयडी", password: "पासवर्ड", signIn: "साइन इन करा",
    loginError: "हा युजर आयडी किंवा पासवर्ड नोंदवहीशी जुळत नाही. कृपया पुन्हा तपासा.",
    opening: "नोंदवही उघडत आहे…", saving: "जतन करत आहे…",
    logout: "बाहेर पडा",
    navSetHomework: "गृहपाठ द्या", navReview: "तपासणी व गुण", navStudents: "विद्यार्थी",
    navSetup: "वर्ग व विषय", navLeaderboard: "गुणवत्ता यादी",
    navToday: "दिवसानुसार गृहपाठ", navHistory: "माझे गुण",
    administrator: "प्रशासक",
    shTitle: "आजचा गृहपाठ द्या", shSub: "वर्ग आणि तारखेनुसार विषयवार गृहपाठ तयार करा.",
    date: "तारीख", subject: "विषय", class: "वर्ग", hwTitle: "गृहपाठाचे शीर्षक",
    hwTitlePlaceholder: "उदा. अपूर्णांक व दशांश — सराव संच ३",
    questions: "प्रश्न", addQuestion: "प्रश्न जोडा",
    questionPlaceholder: "प्रश्न लिहा, उदा. ३/४ + १/८ = ?", answerPlaceholder: "बरोबर उत्तर",
    pointsPlaceholder: "गुण", saveHomework: "गृहपाठ जतन करा",
    recentlySet: "अलीकडे दिलेला गृहपाठ",
    noHomeworkYet: "अजून गृहपाठ दिलेला नाही. वरील माहिती भरून पहिला गृहपाठ तयार करा.",
    fillTitleErr: "जतन करण्यापूर्वी शीर्षक आणि सर्व प्रश्न भरा.",
    savedToast: "\"{title}\" हा गृहपाठ {cls} साठी {date} रोजी दिला.",
    removeHwConfirm: "हा गृहपाठ काढायचा का? विद्यार्थ्यांची उत्तरे यापुढे दिसणार नाहीत.",
    rvTitle: "तपासणी व गुण", rvSub: "कोणी गृहपाठ केला आणि किती गुण मिळाले ते पाहा.",
    selectHomework: "गृहपाठ निवडा", noHomeworkOption: "अजून गृहपाठ नाही",
    studentsIn: "{cls} मधील विद्यार्थी", submitted: "जमा केले", pending: "बाकी", maxScore: "कमाल गुण",
    colStudent: "विद्यार्थी", colUserId: "युजर आयडी", colStatus: "स्थिती", colScore: "गुण",
    statusSubmitted: "जमा केले", statusNotYet: "अजून नाही",
    noStudentsInClass: "या वर्गात अजून विद्यार्थी नाहीत.",
    setHomeworkFirst: "प्रथम गृहपाठ तयार करा, मग इथे तपासणी करता येईल.",
    msTitle: "विद्यार्थी व्यवस्थापन", msSub: "लॉगिन तयार करा, वर्ग नेमून द्या, पासवर्ड बदला.",
    fullName: "पूर्ण नाव", namePlaceholder: "उदा. आरव पाटील", userIdPlaceholder: "उदा. stu3",
    pwPlaceholder: "पासवर्ड सेट करा", addStudent: "विद्यार्थी जोडा",
    fillAllErr: "नाव, युजर आयडी, पासवर्ड आणि वर्ग भरा.",
    idTakenErr: "हा युजर आयडी आधीच वापरला आहे — दुसरा निवडा.",
    addedToast: "{name} ला {cls} मध्ये जोडले.",
    removeStudentConfirm: "या विद्यार्थ्याचे लॉगिन काढायचे का? हे परत मिळणार नाही.",
    resetPwPrompt: "या विद्यार्थ्यासाठी नवीन पासवर्ड टाका:", pwUpdated: "पासवर्ड बदलला.",
    colName: "नाव",
    noStudentsYet: "अजून विद्यार्थी नाहीत — वर पहिला विद्यार्थी जोडा.",
    stTitle: "वर्ग आणि विषय", stSub: "तुम्ही शिकवत असलेले वर्ग आणि विषय सेट करा.",
    classesLabel: "वर्ग", subjectsLabel: "विषय",
    classPlaceholder: "उदा. इयत्ता ७", subjectPlaceholder: "उदा. सामाजिक शास्त्र", add: "जोडा",
    classExistsErr: "हा वर्ग आधीच आहे.", subjectExistsErr: "हा विषय आधीच आहे.",
    removeClassConfirm: "\"{c}\" काढायचा का? आधीचे विद्यार्थी नवीन वर्ग नेमेपर्यंत तोच ठेवतील.",
    removeSubjectConfirm: "\"{s}\" काढायचा का?",
    dhTitle: "दिवसानुसार गृहपाठ", dhSub: "{cls} साठीचा गृहपाठ, दिवसानुसार पाहा.",
    jumpLabel: "गृहपाठ असलेल्या दुसऱ्या तारखेला जा", selectDatePlaceholder: "तारीख निवडा…",
    today: "आज", noHomeworkForDay: "या दिवशी गृहपाठ नाही. मोकळा वेळ एन्जॉय करा!",
    questionsCount: "{n} प्रश्न", pointsWord: "गुण", solve: "सोडवा",
    blankConfirm: "{n} प्रश्न रिकामे आहेत. तरीही जमा करायचे का?",
    typeAnswerPlaceholder: "तुमचे उत्तर लिहा", cancel: "रद्द करा", submitHomework: "गृहपाठ जमा करा",
    submittedToast: "जमा झाले! तुम्हाला {score}/{max} गुण मिळाले.",
    yourAnswer: "तुमचे उत्तर:", correctLabel: "बरोबर उत्तर:", backToList: "गृहपाठ यादीकडे परत जा",
    msrTitle: "माझे गुण", msrSub: "तुम्ही जमा केलेला प्रत्येक गृहपाठ आणि तुमचे गुण.",
    statSubmitted: "जमा केले", statTotalPoints: "एकूण गुण", statAccuracy: "अचूकता",
    colDate: "तारीख", colSubject: "विषय", colHomework: "गृहपाठ",
    noSubmissions: "अजून सबमिशन नाही — पहिला गृहपाठ सोडवा.",
    lbTitle: "गुणवत्ता यादी", lbSub: "सर्व गृहपाठातील एकूण गुणांनुसार क्रमवारी.",
    filterLabel: "वर्गानुसार गाळा", allClasses: "सर्व वर्ग",
    headRank: "क्रमांक", headStudent: "विद्यार्थी", headClass: "वर्ग", headDone: "पूर्ण", headPoints: "गुण",
    youSuffix: " (तुम्ही)", ptsWord: "गुण",
    noScoresYet: "अजून गुण नाहीत — गृहपाठ जमा झाल्यावर यादी भरेल.",
    saveErr: "जतन होऊ शकले नाही — कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.",
    yes: "हो", no: "नाही", ok: "ठीक आहे",
    lockedHw: "ही तारीख अजून आलेली नाही", availableOn: "{date} रोजी उपलब्ध होईल",
    subNavHomework: "गृहपाठ", subNavScores: "माझे गुण", subNavLeaderboard: "गुणवत्ता यादी",
    reattempt: "पुन्हा प्रयत्न करा", reattemptBadge: "पुन्हा प्रयत्न",
    reattemptNote: "पुन्हा केलेले प्रयत्न गुणवत्ता यादीत मोजले जात नाहीत.",
    reattemptSection: "पुन्हा प्रयत्न केलेले", noReattempts: "अजून पुन्हा प्रयत्न केलेला नाही.",
    reattemptOf: "\"{title}\" चा पुन्हा प्रयत्न",
    vTitle: "उभा गणित (बेरीज/वजाबाकी/गुणाकार/भागाकार)",
    vAdd: "उभे गणित जोडा", vOperand1: "पहिली संख्या", vOperand2: "दुसरी संख्या",
    vOperator: "क्रिया", vAddition: "बेरीज", vSubtraction: "वजाबाकी",
    vMultiplication: "गुणाकार", vDivision: "भागाकार", vPoints: "गुण",
    vAnswerPlaceholder: "उत्तर लिहा",
    notesTitle: "नोट्स", notesSub: "शिक्षकांनी दिलेले फोटो व पीडीएफ पाहा.",
    notesSubTeacher: "फोटो व पीडीएफ अपलोड करा — विद्यार्थी झूम करून पाहू शकतील.",
    uploadNote: "फोटो / पीडीएफ अपलोड करा", noNotesYet: "अजून नोट्स नाहीत.",
    removeNoteConfirm: "\"{n}\" काढायचे का?", noteUploaded: "\"{n}\" अपलोड झाले.",
    noteUploadErr: "अपलोड होऊ शकले नाही — फाईल खूप मोठी असू शकते.",
    zoomIn: "झूम इन", zoomOut: "झूम आउट", close: "बंद करा",
    videosTitle: "व्हिडिओ", videosSub: "शिक्षकांनी दिलेले व्हिडिओ पाहा.",
    videosSubTeacher: "यूट्यूब लिंक जोडा आणि क्रम ठरवा.",
    videoTitlePlaceholder: "व्हिडिओचे नाव", videoUrlPlaceholder: "यूट्यूब लिंक चिकटवा",
    addVideo: "व्हिडिओ जोडा", noVideosYet: "अजून व्हिडिओ नाहीत.",
    removeVideoConfirm: "\"{n}\" काढायचा का?", invalidYoutubeUrl: "ही यूट्यूब लिंक ओळखता आली नाही.",
    videoAdded: "\"{n}\" जोडले.",
    navNotes: "नोट्स", navVideos: "व्हिडिओ",
    navBackup: "बॅकअप", backupTitle: "बॅकअप व पुनर्संचयन", backupSub: "सर्व माहितीची प्रत जतन करा किंवा जुनी प्रत परत आणा.",
    backupDesc: "सर्व विद्यार्थी, गृहपाठ, गुण, नोट्स व व्हिडिओंची एक फाईल डाउनलोड करा. ही फाईल सुरक्षित ठिकाणी ठेवा.",
    downloadBackup: "बॅकअप डाउनलोड करा", backupDone: "बॅकअप डाउनलोड झाला.",
    restoreTitle: "पुनर्संचयन", restoreDesc: "आधी डाउनलोड केलेली बॅकअप फाईल निवडा. यामुळे सध्याची सर्व माहिती त्या फाईलमधील माहितीने बदलली जाईल.",
    chooseFile: "फाईल निवडा",
    restoreConfirm: "यामुळे सध्याची सर्व माहिती निवडलेल्या फाईलमधील माहितीने बदलली जाईल. ही क्रिया परत बदलता येणार नाही. पुढे जायचे का?",
    restoreDone: "माहिती यशस्वीरित्या पुनर्संचयित झाली.",
    restoreErr: "फाईल वाचता आली नाही — योग्य बॅकअप फाईल निवडा.",
    addMcq: "बहुपर्यायी प्रश्न जोडा", mcqOptionPlaceholder: "पर्याय {n}",
    addPhoto: "फोटो जोडा", answerWithPhoto: "फोटोद्वारे उत्तर द्या",
    photoAnswerNote: "फोटो उत्तर जमा केले — शिक्षक ते तपासतील.",
    needsCheck: "तपासा", viewAnswers: "उत्तरे पाहा",
    markCorrect: "बरोबर", markIncorrect: "चूक",
  },
  en: {
    appName: "जि.प.प्रा.शा. भांगापूर", appTagline: "Daily assignments, scored & ranked",
    roleStudent: "Student", roleTeacher: "Teacher",
    userId: "User ID", password: "Password", signIn: "Sign in",
    loginError: "That user ID or password doesn't match our register. Double-check and try again.",
    opening: "Opening the register…", saving: "Saving…",
    logout: "Log out",
    navSetHomework: "Set Homework", navReview: "Review & Scores", navStudents: "Students",
    navSetup: "Classes & Subjects", navLeaderboard: "Leaderboard",
    navToday: "Day-wise Homework", navHistory: "My Scores",
    administrator: "Administrator",
    shTitle: "Set today's homework", shSub: "Create subject-wise assignments for a class and date.",
    date: "Date", subject: "Subject", class: "Class", hwTitle: "Homework title",
    hwTitlePlaceholder: "e.g. Fractions & Decimals — Practice Set 3",
    questions: "Questions", addQuestion: "Add question",
    questionPlaceholder: "Question text, e.g. 3/4 + 1/8 = ?", answerPlaceholder: "Correct answer",
    pointsPlaceholder: "Pts", saveHomework: "Save homework",
    recentlySet: "Recently set",
    noHomeworkYet: "No homework set yet. Create the first one above.",
    fillTitleErr: "Fill in the homework title and every question before saving.",
    savedToast: "Homework \"{title}\" set for {cls} on {date}.",
    removeHwConfirm: "Remove this homework? Student submissions for it will no longer be shown.",
    rvTitle: "Review & scores", rvSub: "See who has done today's homework, and how they scored.",
    selectHomework: "Select homework", noHomeworkOption: "No homework set yet",
    studentsIn: "Students in {cls}", submitted: "Submitted", pending: "Pending", maxScore: "Max score",
    colStudent: "Student", colUserId: "User ID", colStatus: "Status", colScore: "Score",
    statusSubmitted: "Submitted", statusNotYet: "Not yet",
    noStudentsInClass: "No students assigned to this class yet.",
    setHomeworkFirst: "Set a homework first to review submissions here.",
    msTitle: "Manage students", msSub: "Create logins, assign classes, and reset passwords.",
    fullName: "Full name", namePlaceholder: "Aarav Patil", userIdPlaceholder: "stu3",
    pwPlaceholder: "Set a password", addStudent: "Add student",
    fillAllErr: "Fill in name, user ID, password and class.",
    idTakenErr: "That user ID is already taken — pick another.",
    addedToast: "Added {name} to {cls}.",
    removeStudentConfirm: "Remove this student's login? This can't be undone.",
    resetPwPrompt: "Enter a new password for this student:", pwUpdated: "Password updated.",
    colName: "Name",
    noStudentsYet: "No students yet — add your first one above.",
    stTitle: "Classes & subjects", stSub: "Set up the classes and subjects you teach.",
    classesLabel: "Classes", subjectsLabel: "Subjects",
    classPlaceholder: "e.g. Class 7", subjectPlaceholder: "e.g. Social Studies", add: "Add",
    classExistsErr: "That class already exists.", subjectExistsErr: "That subject already exists.",
    removeClassConfirm: "Remove \"{c}\"? Existing students keep it until reassigned.",
    removeSubjectConfirm: "Remove \"{s}\"?",
    dhTitle: "Day-wise homework", dhSub: "Assignments for {cls}, picked by day.",
    jumpLabel: "Jump to another date with homework", selectDatePlaceholder: "Select a date…",
    today: "Today", noHomeworkForDay: "No homework set for this day. Enjoy the free time!",
    questionsCount: "{n} question(s)", pointsWord: "points", solve: "Solve",
    blankConfirm: "{n} question(s) left blank. Submit anyway?",
    typeAnswerPlaceholder: "Type your answer", cancel: "Cancel", submitHomework: "Submit homework",
    submittedToast: "Submitted! You scored {score}/{max}.",
    yourAnswer: "Your answer:", correctLabel: "Correct:", backToList: "Back to homework list",
    msrTitle: "My scores", msrSub: "Every homework you've submitted, and how you did.",
    statSubmitted: "Submitted", statTotalPoints: "Total points", statAccuracy: "Accuracy",
    colDate: "Date", colSubject: "Subject", colHomework: "Homework",
    noSubmissions: "No submissions yet — solve your first homework to see it here.",
    lbTitle: "Leaderboard", lbSub: "Ranked by total points scored across all homework.",
    filterLabel: "Filter by class", allClasses: "All classes",
    headRank: "Rank", headStudent: "Student", headClass: "Class", headDone: "Done", headPoints: "Points",
    youSuffix: " (you)", ptsWord: "pts",
    noScoresYet: "No scores yet — the leaderboard fills up as homework gets submitted.",
    saveErr: "Could not save — check connection and try again.",
    yes: "Yes", no: "No", ok: "OK",
    lockedHw: "Not available yet", availableOn: "Available on {date}",
    subNavHomework: "Homework", subNavScores: "My Scores", subNavLeaderboard: "Leaderboard",
    reattempt: "Reattempt", reattemptBadge: "Reattempt",
    reattemptNote: "Reattempts are not counted on the leaderboard.",
    reattemptSection: "Reattempts", noReattempts: "No reattempts yet.",
    reattemptOf: "Reattempt of \"{title}\"",
    vTitle: "Vertical arithmetic (add / subtract / multiply / divide)",
    vAdd: "Add vertical problem", vOperand1: "First number", vOperand2: "Second number",
    vOperator: "Operation", vAddition: "Addition", vSubtraction: "Subtraction",
    vMultiplication: "Multiplication", vDivision: "Division", vPoints: "Points",
    vAnswerPlaceholder: "Answer",
    notesTitle: "Notes", notesSub: "View photos and PDFs shared by your teacher.",
    notesSubTeacher: "Upload photos and PDFs — students can view and zoom them.",
    uploadNote: "Upload photo / PDF", noNotesYet: "No notes yet.",
    removeNoteConfirm: "Remove \"{n}\"?", noteUploaded: "\"{n}\" uploaded.",
    noteUploadErr: "Couldn't upload — the file may be too large.",
    zoomIn: "Zoom in", zoomOut: "Zoom out", close: "Close",
    videosTitle: "Videos", videosSub: "Watch videos shared by your teacher.",
    videosSubTeacher: "Add YouTube links and set their order.",
    videoTitlePlaceholder: "Video title", videoUrlPlaceholder: "Paste YouTube link",
    addVideo: "Add video", noVideosYet: "No videos yet.",
    removeVideoConfirm: "Remove \"{n}\"?", invalidYoutubeUrl: "Couldn't recognize that YouTube link.",
    videoAdded: "\"{n}\" added.",
    navNotes: "Notes", navVideos: "Videos",
    navBackup: "Backup", backupTitle: "Backup & restore", backupSub: "Save a copy of all data, or bring back an older copy.",
    backupDesc: "Download a single file with all students, homework, scores, notes and videos. Keep this file somewhere safe.",
    downloadBackup: "Download backup", backupDone: "Backup downloaded.",
    restoreTitle: "Restore", restoreDesc: "Choose a backup file you downloaded earlier. This will replace all current data with the data in that file.",
    chooseFile: "Choose file",
    restoreConfirm: "This will replace all current data with the data in the selected file. This cannot be undone. Continue?",
    restoreDone: "Data restored successfully.",
    restoreErr: "Couldn't read that file — choose a valid backup file.",
    addMcq: "Add MCQ question", mcqOptionPlaceholder: "Option {n}",
    addPhoto: "Add photo", answerWithPhoto: "Answer with a photo",
    photoAnswerNote: "Photo answer submitted — your teacher will check it.",
    needsCheck: "Needs check", viewAnswers: "View answers",
    markCorrect: "Correct", markIncorrect: "Incorrect",
  },
};
function makeT(lang) {
  return (key, vars) => {
    let s = (STRINGS[lang] && STRINGS[lang][key]) ?? STRINGS.en[key] ?? key;
    if (vars) Object.entries(vars).forEach(([k, v]) => { s = s.split(`{${k}}`).join(v); });
    return s;
  };
}

// ---------- constants ----------
const TODAY = new Date();
const isoDate = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const TODAY_ISO = isoDate(TODAY);
const DAY_NAMES = { mr: ["सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि", "रवि"], en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] };
const friendlyDate = (iso, lang) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { weekday: "short", day: "numeric", month: "short" });
};
const uid = (p = "") => p + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

const weekStrip = (anchorIso) => {
  const anchor = new Date(anchorIso + "T00:00:00");
  const dow = (anchor.getDay() + 6) % 7; // 0=Mon
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return isoDate(d);
  });
};

const parseYoutubeId = (url) => {
  const s = String(url ?? "").trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = s.match(re);
    if (m) return m[1];
  }
  if (/^[\w-]{11}$/.test(s)) return s;
  return null;
};

const OP_SYMBOLS = { add: "+", sub: "−", mul: "×", div: "÷" };
const computeVertical = (a, b, op) => {
  const na = Number(a), nb = Number(b);
  if (isNaN(na) || isNaN(nb)) return "";
  if (op === "add") return String(na + nb);
  if (op === "sub") return String(na - nb);
  if (op === "mul") return String(na * nb);
  if (op === "div") return nb === 0 ? "" : String(Math.round((na / nb) * 1000) / 1000);
  return "";
};

// Points can legitimately be 0 (e.g. a bonus/practice question) — never fall
// back to 1 unless the value truly isn't a number.
const ptsOf = (q) => {
  const n = Number(q?.points);
  return Number.isFinite(n) ? n : 1;
};

// ---------- photo auto-delete (images only kept for today/future homework) ----------
function stripPastQuestionImages(hw) {
  let changed = false;
  const cleaned = hw.map((h) => {
    if (h.date < TODAY_ISO && h.questions.some((q) => q.image)) {
      changed = true;
      return { ...h, questions: h.questions.map((q) => { const { image, ...rest } = q; return rest; }) };
    }
    return h;
  });
  return { changed, cleaned };
}
function stripPastAnswerImages(list, hwById) {
  let changed = false;
  const cleaned = list.map((s) => {
    const h = hwById[s.homeworkId];
    if (h && h.date < TODAY_ISO && Array.isArray(s.answers) && s.answers.some((a) => a.givenImage)) {
      changed = true;
      return { ...s, answers: s.answers.map((a) => { const { givenImage, ...rest } = a; return rest; }) };
    }
    return s;
  });
  return { changed, cleaned };
}

const normalize = (s) => String(s ?? "").trim().toLowerCase().replace(/\s+/g, " ");
const answersMatch = (given, correct) => {
  const g = normalize(given), c = normalize(correct);
  if (!g) return false;
  if (g === c) return true;
  const gn = parseFloat(g), cn = parseFloat(c);
  if (!isNaN(gn) && !isNaN(cn) && String(gn) !== "NaN") return Math.abs(gn - cn) < 1e-9;
  return false;
};

// ---------- storage helpers ----------
// Backed by a single Supabase table `app_state` (key text primary key, value jsonb).
// Falls back to an in-memory store if Supabase is unreachable, so the app
// never gets stuck unable to read/write its own data. Live sync across
// devices happens separately via a Postgres Realtime subscription (see App()).
const memStore = {};
async function loadKey(key, fallback) {
  try {
    const { data, error } = await supabase
      .from("app_state")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) throw error;
    if (data && data.value != null) return data.value;
    return fallback;
  } catch (e) { /* fall through to mem store */ }
  if (key in memStore) { try { return JSON.parse(memStore[key]); } catch (e) {} }
  return fallback;
}
async function saveKey(key, value) {
  memStore[key] = JSON.stringify(value);
  try {
    const { error } = await supabase
      .from("app_state")
      .upsert({ key, value, updated_at: new Date().toISOString() });
    if (error) throw error;
    return true;
  } catch (e) {
    return false;
  }
}

const SEED_USERS = {
  teacher1: { password: "teacher123", role: "teacher", name: "Mrs. Sharma", className: "" },
  stu1: { password: "student123", role: "student", name: "Aarav Patil", className: "Class 8" },
  stu2: { password: "student123", role: "student", name: "Isha Kulkarni", className: "Class 8" },
};
const SEED_SUBJECTS = ["Mathematics", "Science", "English"];
const SEED_CLASSES = ["Class 8", "Class 9", "Class 10"];

// ---------- root ----------
export default function App() {
  const [booting, setBooting] = useState(true);
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [homework, setHomework] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [reattempts, setReattempts] = useState([]);
  const [notes, setNotes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [lang, setLang] = useState("mr");
  const [dialog, setDialog] = useState(null); // { message, kind: 'confirm'|'prompt', defaultValue, resolve }
  const t = useMemo(() => makeT(lang), [lang]);

  const confirmDialog = useCallback((message) => new Promise((resolve) => {
    setDialog({ message, kind: "confirm", resolve });
  }), []);
  const promptDialog = useCallback((message, defaultValue = "") => new Promise((resolve) => {
    setDialog({ message, kind: "prompt", defaultValue, resolve });
  }), []);

  useEffect(() => {
    (async () => {
      let u = await loadKey("hl_users", null);
      let subj = await loadKey("hl_subjects", null);
      let cls = await loadKey("hl_classes", null);
      let hw = await loadKey("hl_homework", null);
      let subs = await loadKey("hl_submissions", null);
      let reat = await loadKey("hl_reattempts", null);
      let nts = await loadKey("hl_notes", null);
      let vids = await loadKey("hl_videos", null);

      if (!u || Object.keys(u).length === 0) { u = SEED_USERS; await saveKey("hl_users", u); }
      if (!subj || subj.length === 0) { subj = SEED_SUBJECTS; await saveKey("hl_subjects", subj); }
      if (!cls || cls.length === 0) { cls = SEED_CLASSES; await saveKey("hl_classes", cls); }
      if (!hw) { hw = []; await saveKey("hl_homework", hw); }
      if (!subs) { subs = []; await saveKey("hl_submissions", subs); }
      if (!reat) { reat = []; await saveKey("hl_reattempts", reat); }
      if (!nts) { nts = []; await saveKey("hl_notes", nts); }
      if (!vids) { vids = []; await saveKey("hl_videos", vids); }

      // Auto-delete photos attached to questions/answers once their day has passed,
      // so storage doesn't keep growing with old homework photos.
      const hwStripped = stripPastQuestionImages(hw);
      if (hwStripped.changed) { hw = hwStripped.cleaned; await saveKey("hl_homework", hw); }
      const hwById = Object.fromEntries(hw.map((h) => [h.id, h]));
      const subsStripped = stripPastAnswerImages(subs, hwById);
      if (subsStripped.changed) { subs = subsStripped.cleaned; await saveKey("hl_submissions", subs); }
      const reatStripped = stripPastAnswerImages(reat, hwById);
      if (reatStripped.changed) { reat = reatStripped.cleaned; await saveKey("hl_reattempts", reat); }

      setUsers(u); setSubjects(subj); setClasses(cls); setHomework(hw); setSubmissions(subs);
      setReattempts(reat); setNotes(nts); setVideos(vids);

      // Restore a previously logged-in session so closing/reopening the tab
      // doesn't log the user out.
      try {
        const savedId = localStorage.getItem("hl_current_user_id");
        if (savedId && u[savedId]) setCurrentUser({ id: savedId, ...u[savedId] });
      } catch (e) { /* localStorage unavailable */ }

      setBooting(false);
    })();
  }, []);

  // Live sync: whenever any device writes to app_state, push the new value
  // into this device's state too — this is what makes teacher/student
  // updates show up on other devices without a manual refresh.
  useEffect(() => {
    const SETTERS = {
      hl_users: setUsers,
      hl_subjects: setSubjects,
      hl_classes: setClasses,
      hl_homework: setHomework,
      hl_submissions: setSubmissions,
      hl_reattempts: setReattempts,
      hl_notes: setNotes,
      hl_videos: setVideos,
    };
    const channel = supabase
      .channel("app_state_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_state" },
        (payload) => {
          const row = payload.new;
          if (!row || !row.key) return;
          const setter = SETTERS[row.key];
          if (setter) setter(row.value);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleLogin = useCallback((u) => {
    setCurrentUser(u);
    try { localStorage.setItem("hl_current_user_id", u.id); } catch (e) {}
  }, []);
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    try { localStorage.removeItem("hl_current_user_id"); } catch (e) {}
  }, []);

  const showToast = useCallback((msg, kind = "ok") => {
    setToast({ msg, kind, id: uid() });
    setTimeout(() => setToast((tt) => (tt && tt.msg === msg ? null : tt)), 2600);
  }, []);

  const persist = useCallback(async (key, setter, value, errMsg) => {
    setter(value);
    setSaving(true);
    const ok = await saveKey(key, value);
    setSaving(false);
    if (!ok) showToast(errMsg, "err");
    return ok;
  }, [showToast]);

  const api = {
    users, subjects, classes, homework, submissions, reattempts, notes, videos, lang, t,
    setUsers: (v) => persist("hl_users", setUsers, v, t("saveErr")),
    setSubjects: (v) => persist("hl_subjects", setSubjects, v, t("saveErr")),
    setClasses: (v) => persist("hl_classes", setClasses, v, t("saveErr")),
    setHomework: (v) => persist("hl_homework", setHomework, v, t("saveErr")),
    setSubmissions: (v) => persist("hl_submissions", setSubmissions, v, t("saveErr")),
    setReattempts: (v) => persist("hl_reattempts", setReattempts, v, t("saveErr")),
    setNotes: (v) => persist("hl_notes", setNotes, v, t("saveErr")),
    setVideos: (v) => persist("hl_videos", setVideos, v, t("saveErr")),
    showToast,
    confirm: confirmDialog,
    prompt: promptDialog,
  };

  return (
    <div className="hl-root">
      <Style />
      {booting ? (
        <div className="hl-boot">
          <Loader2 className="spin" size={26} />
          <span>{t("opening")}</span>
        </div>
      ) : !currentUser ? (
        <Login users={users} onLogin={handleLogin} lang={lang} setLang={setLang} t={t} />
      ) : currentUser.role === "teacher" ? (
        <TeacherApp user={currentUser} api={api} onLogout={handleLogout} />
      ) : (
        <StudentApp user={currentUser} api={api} onLogout={handleLogout} />
      )}
      {saving && <div className="hl-saving"><Loader2 className="spin" size={13} /> {t("saving")}</div>}
      {toast && (
        <div className={`hl-toast ${toast.kind === "err" ? "err" : ""}`}>
          {toast.kind === "err" ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />} {toast.msg}
        </div>
      )}
      {dialog && <DialogModal dialog={dialog} onClose={() => setDialog(null)} t={t} />}
    </div>
  );
}

// ---------- confirm / prompt modal (replaces window.confirm / window.prompt,
// which are blocked inside the sandboxed artifact frame) ----------
function DialogModal({ dialog, onClose, t }) {
  const [value, setValue] = useState(dialog.defaultValue || "");
  const finish = (result) => { dialog.resolve(result); onClose(); };
  const onKeyDown = (e) => {
    if (e.key === "Enter") finish(dialog.kind === "prompt" ? value : true);
    if (e.key === "Escape") finish(dialog.kind === "prompt" ? null : false);
  };
  return (
    <div className="hl-modal-overlay" onClick={() => finish(dialog.kind === "prompt" ? null : false)}>
      <div className="hl-modal-card" onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <p className="hl-modal-msg">{dialog.message}</p>
        {dialog.kind === "prompt" && (
          <input autoFocus className="hl-modal-input" value={value} onChange={(e) => setValue(e.target.value)} />
        )}
        <div className="hl-row-actions gap">
          <button className="hl-btn ghost" type="button" onClick={() => finish(dialog.kind === "prompt" ? null : false)}>{t("no")}</button>
          <button className="hl-btn primary" type="button" autoFocus={dialog.kind !== "prompt"} onClick={() => finish(dialog.kind === "prompt" ? value : true)}>
            {dialog.kind === "prompt" ? t("ok") : t("yes")}
          </button>
        </div>
      </div>
    </div>
  );
}

function LangToggle({ lang, setLang, compact }) {
  return (
    <button type="button" className={`hl-lang-toggle ${compact ? "compact" : ""}`} onClick={() => setLang(lang === "mr" ? "en" : "mr")} title="भाषा बदला / Change language">
      <Languages size={14} /> {lang === "mr" ? "EN" : "मर"}
    </button>
  );
}

// ---------- LOGIN ----------
function Login({ users, onLogin, lang, setLang, t }) {
  const [role, setRole] = useState("student");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    const account = users[id.trim()];
    if (!account || account.password !== pw || account.role !== role) {
      setErr(t("loginError"));
      return;
    }
    setErr("");
    onLogin({ id: id.trim(), ...account });
  };
  const onEnter = (e) => { if (e.key === "Enter") submit(); };

  return (
    <div className="hl-login-screen">
      <div className="hl-login-card">
        <div className="hl-login-top">
          <div className="hl-brand">
            <div className="hl-brand-mark"><BookOpen size={22} /></div>
            <div>
              <div className="hl-brand-title">{t("appName")}</div>
              <div className="hl-brand-sub">{t("appTagline")}</div>
            </div>
          </div>
          <LangToggle lang={lang} setLang={setLang} />
        </div>

        <div className="hl-role-toggle">
          <button type="button" className={role === "student" ? "active" : ""} onClick={() => setRole("student")}>
            <GraduationCap size={16} /> {t("roleStudent")}
          </button>
          <button type="button" className={role === "teacher" ? "active" : ""} onClick={() => setRole("teacher")}>
            <School size={16} /> {t("roleTeacher")}
          </button>
        </div>

        <div className="hl-form">
          <label className="hl-field">
            <span><User size={13} /> {t("userId")}</span>
            <input value={id} onChange={(e) => setId(e.target.value)} onKeyDown={onEnter} placeholder="stu1" autoComplete="username" />
          </label>
          <label className="hl-field">
            <span><Lock size={13} /> {t("password")}</span>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={onEnter} placeholder="••••••••" autoComplete="current-password" />
          </label>
          {err && <div className="hl-error"><AlertCircle size={14} /> {err}</div>}
          <button className="hl-btn primary wide" type="button" onClick={submit}>{t("signIn")}</button>
        </div>
      </div>
    </div>
  );
}

// ---------- SHELL ----------
function Shell({ user, onLogout, tabs, active, setActive, roleLabel, api, children, profileContent, profileLabel }) {
  const { lang, setLang, t } = api;
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <div className="hl-shell">
      <header className="hl-topbar">
        <div className="hl-brand small">
          <div className="hl-brand-mark"><BookOpen size={18} /></div>
          <div className="hl-brand-title small truncate">{t("appName")}</div>
        </div>
        <div className="hl-topbar-right">
          <button className="hl-icon-btn" onClick={() => setMenuOpen(true)} title={t("logout")}><Menu size={18} /></button>
        </div>
      </header>

      <aside className="hl-side">
        <div className="hl-brand">
          <div className="hl-brand-mark"><BookOpen size={18} /></div>
          <div>
            <div className="hl-brand-title small">{t("appName")}</div>
            <div className="hl-brand-sub small">{roleLabel}</div>
          </div>
        </div>
        <nav className="hl-nav">
          {tabs.map((tb) => (
            <button key={tb.key} className={active === tb.key ? "active" : ""} onClick={() => setActive(tb.key)}>
              {tb.icon} <span>{tb.label}</span>
            </button>
          ))}
          {profileContent && (
            <button onClick={() => setProfileOpen(true)}><User size={18} /> <span>{profileLabel}</span></button>
          )}
        </nav>
        <div className="hl-side-footer">
          <LangToggle lang={lang} setLang={setLang} />
          <div className="hl-user-chip">
            <div className="hl-avatar">{user.name?.[0] ?? "?"}</div>
            <div>
              <div className="hl-user-name">{user.name}</div>
              <div className="hl-user-sub">{roleLabel}</div>
            </div>
          </div>
          <button className="hl-btn ghost wide" onClick={onLogout}><LogOut size={15} /> {t("logout")}</button>
        </div>
      </aside>

      <main className="hl-main">{children}</main>

      <nav className="hl-bottom-nav">
        {tabs.map((tb) => (
          <button key={tb.key} className={active === tb.key ? "active" : ""} onClick={() => setActive(tb.key)}>
            {tb.icon} <span>{tb.label}</span>
          </button>
        ))}
      </nav>

      {menuOpen && (
        <div className="hl-modal-overlay" onClick={() => setMenuOpen(false)}>
          <div className="hl-menu-card" onClick={(e) => e.stopPropagation()}>
            <div className="hl-user-chip">
              <div className="hl-avatar">{user.name?.[0] ?? "?"}</div>
              <div>
                <div className="hl-user-name">{user.name}</div>
                <div className="hl-user-sub">{roleLabel}</div>
              </div>
            </div>
            {profileContent && (
              <button className="hl-btn ghost wide" onClick={() => { setMenuOpen(false); setProfileOpen(true); }}>
                <User size={15} /> {profileLabel}
              </button>
            )}
            <button className="hl-btn ghost wide" onClick={() => setLang(lang === "mr" ? "en" : "mr")}>
              <Languages size={15} /> {lang === "mr" ? "English" : "मराठी"}
            </button>
            <button className="hl-btn ghost wide" onClick={() => { setMenuOpen(false); onLogout(); }}>
              <LogOut size={15} /> {t("logout")}
            </button>
          </div>
        </div>
      )}

      {profileOpen && (
        <div className="hl-modal-overlay" onClick={() => setProfileOpen(false)}>
          <div className="hl-zoom-card" onClick={(e) => e.stopPropagation()}>
            <div className="hl-zoom-toolbar">
              <span className="hl-note-name">{profileLabel}</span>
              <button className="hl-icon-btn" onClick={() => setProfileOpen(false)} title={t("close")}><X size={16} /></button>
            </div>
            <div className="hl-zoom-body hl-profile-body">{profileContent}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================= TEACHER =================
function TeacherApp({ user, api, onLogout }) {
  const { t } = api;
  const [active, setActive] = useState("homework");
  const tabs = [
    { key: "homework", label: t("navSetHomework"), icon: <ClipboardList size={18} /> },
    { key: "review", label: t("navReview"), icon: <BarChart3 size={18} /> },
    { key: "students", label: t("navStudents"), icon: <Users size={18} /> },
    { key: "setup", label: t("navSetup"), icon: <Layers size={18} /> },
    { key: "leaderboard", label: t("navLeaderboard"), icon: <Trophy size={18} /> },
    { key: "videos", label: t("navVideos"), icon: <VideoIcon size={18} /> },
    { key: "backup", label: t("navBackup"), icon: <Save size={18} /> },
  ];
  return (
    <Shell user={user} onLogout={onLogout} tabs={tabs} active={active} setActive={setActive} roleLabel={t("roleTeacher")} api={api}>
      {active === "homework" && <SetHomework api={api} />}
      {active === "review" && <ReviewScores api={api} />}
      {active === "students" && <ManageStudents api={api} />}
      {active === "setup" && <ManageSetup api={api} />}
      {active === "leaderboard" && <Leaderboard api={api} />}
      {active === "videos" && <VideosManager api={api} isTeacher />}
      {active === "backup" && <BackupRestore api={api} />}
    </Shell>
  );
}

// ---------- BACKUP / RESTORE ----------
function BackupRestore({ api }) {
  const {
    users, subjects, classes, homework, submissions, reattempts, notes, videos,
    setUsers, setSubjects, setClasses, setHomework, setSubmissions, setReattempts, setNotes, setVideos,
    showToast, confirm, t,
  } = api;

  const handleBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      users, subjects, classes, homework, submissions, reattempts, notes, videos,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `homework-ledger-backup-${TODAY_ISO}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t("backupDone"));
  };

  const handleRestoreFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const proceed = await confirm(t("restoreConfirm"));
    if (!proceed) { e.target.value = ""; return; }
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.users) await setUsers(data.users);
      if (data.subjects) await setSubjects(data.subjects);
      if (data.classes) await setClasses(data.classes);
      if (data.homework) await setHomework(data.homework);
      if (data.submissions) await setSubmissions(data.submissions);
      if (data.reattempts) await setReattempts(data.reattempts);
      if (data.notes) await setNotes(data.notes);
      if (data.videos) await setVideos(data.videos);
      showToast(t("restoreDone"));
    } catch (err) {
      showToast(t("restoreErr"), "err");
    }
    e.target.value = "";
  };

  return (
    <div>
      <div className="hl-page-head">
        <div className="hl-page-icon"><Save size={20} /></div>
        <div>
          <h2>{t("backupTitle")}</h2>
          <p>{t("backupSub")}</p>
        </div>
      </div>

      <div className="hl-card">
        <div className="hl-subhead">{t("backupTitle")}</div>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{t("backupDesc")}</p>
        <button className="hl-btn primary" type="button" onClick={handleBackup} style={{ width: "fit-content" }}>
          <Save size={15} /> {t("downloadBackup")}
        </button>
      </div>

      <div className="hl-card">
        <div className="hl-subhead" style={{ marginTop: 0 }}>{t("restoreTitle")}</div>
        <p style={{ margin: 0, fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{t("restoreDesc")}</p>
        <label className="hl-btn ghost hl-upload-btn" style={{ width: "fit-content" }}>
          <Upload size={15} /> {t("chooseFile")}
          <input type="file" accept="application/json" style={{ display: "none" }} onChange={handleRestoreFile} />
        </label>
      </div>
    </div>
  );
}

function SetHomework({ api }) {
  const { subjects, classes, homework, setHomework, showToast, t, lang, confirm } = api;
  const [date, setDate] = useState(TODAY_ISO);
  const [subject, setSubject] = useState(subjects[0] || "");
  const [className, setClassName] = useState(classes[0] || "");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ id: uid("q"), text: "", answer: "", points: 1 }]);
  const [vA, setVA] = useState(""); const [vB, setVB] = useState("");
  const [vOp, setVOp] = useState("add"); const [vPts, setVPts] = useState(1);

  useEffect(() => { if (!subject && subjects[0]) setSubject(subjects[0]); }, [subjects]);
  useEffect(() => { if (!className && classes[0]) setClassName(classes[0]); }, [classes]);

  const addQuestion = () => setQuestions((qs) => [...qs, { id: uid("q"), text: "", answer: "", points: 1 }]);
  const addMcqQuestion = () => setQuestions((qs) => [...qs, { id: uid("q"), type: "mcq", text: "", options: ["", "", "", ""], correctIndex: 0, answer: "", points: 1 }]);
  const removeQuestion = (id) => setQuestions((qs) => qs.filter((q) => q.id !== id));
  const updateQuestion = (id, field, val) => setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, [field]: val } : q)));
  const updateOption = (id, idx, val) => setQuestions((qs) => qs.map((q) => {
    if (q.id !== id) return q;
    const options = q.options.map((o, i) => (i === idx ? val : o));
    return { ...q, options, answer: q.correctIndex === idx ? val : q.answer };
  }));
  const setCorrectOption = (id, idx) => setQuestions((qs) => qs.map((q) => (
    q.id === id ? { ...q, correctIndex: idx, answer: q.options[idx] || "" } : q
  )));
  const setQuestionImage = async (id, file) => {
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, image: dataUrl } : q)));
    } catch (e) { showToast(t("noteUploadErr"), "err"); }
  };
  const clearQuestionImage = (id) => setQuestions((qs) => qs.map((q) => {
    if (q.id !== id) return q;
    const { image, ...rest } = q;
    return rest;
  }));

  const addVerticalQuestion = () => {
    if (vA === "" || vB === "") return;
    const answer = computeVertical(vA, vB, vOp);
    setQuestions((qs) => [
      ...qs,
      { id: uid("q"), type: "vertical", a: Number(vA), b: Number(vB), op: vOp,
        text: `${vA} ${OP_SYMBOLS[vOp]} ${vB}`, answer, points: Number.isFinite(Number(vPts)) ? Number(vPts) : 1 },
    ]);
    setVA(""); setVB("");
  };

  const canSave = title.trim() && subject && className && questions.every((q) => {
    if (q.type === "mcq") return q.text.trim() && q.options.every((o) => o.trim()) && q.answer.trim();
    return q.text.trim() && q.answer.trim();
  });

  const save = async () => {
    if (!canSave) { showToast(t("fillTitleErr"), "err"); return; }
    const entry = {
      id: uid("hw"), date, subject, className, title: title.trim(),
      questions: questions.map((q) => ({ ...q, points: ptsOf(q) })),
      createdAt: Date.now(),
    };
    await setHomework([entry, ...homework]);
    showToast(t("savedToast", { title: entry.title, cls: className, date: friendlyDate(date, lang) }));
    setTitle(""); setQuestions([{ id: uid("q"), text: "", answer: "", points: 1 }]);
  };

  const grouped = useMemo(() => [...homework].sort((a, b) => (a.date < b.date ? 1 : -1)), [homework]);

  const removeHomework = async (id) => {
    if (!(await confirm(t("removeHwConfirm")))) return;
    await setHomework(homework.filter((h) => h.id !== id));
  };

  return (
    <div className="hl-page">
      <PageHead icon={<ClipboardList size={20} />} title={t("shTitle")} sub={t("shSub")} />

      <div className="hl-card">
        <div className="hl-grid-3">
          <label className="hl-field">
            <span><Calendar size={13} /> {t("date")}</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="hl-field">
            <span>{t("subject")}</span>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="hl-field">
            <span>{t("class")}</span>
            <select value={className} onChange={(e) => setClassName(e.target.value)}>
              {classes.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <label className="hl-field">
          <span>{t("hwTitle")}</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("hwTitlePlaceholder")} />
        </label>

        <div className="hl-q-list">
          <div className="hl-q-head">
            <span>{t("questions")}</span>
            <div className="hl-row-actions">
              <button className="hl-btn ghost sm" onClick={addQuestion}><Plus size={14} /> {t("addQuestion")}</button>
              <button className="hl-btn ghost sm" onClick={addMcqQuestion}><ListChecks size={14} /> {t("addMcq")}</button>
            </div>
          </div>
          {questions.map((q, i) => (
            <div className="hl-q-block" key={q.id}>
              {q.type === "mcq" ? (
                <div className="hl-q-mcq">
                  <div className="hl-q-mcq-top">
                    <div className="hl-q-num">{i + 1}<ListChecks size={11} className="hl-q-vert-mark" /></div>
                    <input className="hl-q-text" placeholder={t("questionPlaceholder")} value={q.text} onChange={(e) => updateQuestion(q.id, "text", e.target.value)} />
                    <input className="hl-q-points" type="number" min="0" placeholder={t("pointsPlaceholder")} value={q.points} onChange={(e) => updateQuestion(q.id, "points", e.target.value)} />
                    <button className="hl-icon-btn danger" onClick={() => removeQuestion(q.id)} disabled={questions.length === 1}><Trash2 size={15} /></button>
                  </div>
                  <div className="hl-mcq-options">
                    {q.options.map((opt, oi) => (
                      <label className="hl-mcq-option" key={oi}>
                        <input type="radio" name={`correct-${q.id}`} checked={q.correctIndex === oi} onChange={() => setCorrectOption(q.id, oi)} />
                        <input placeholder={t("mcqOptionPlaceholder", { n: oi + 1 })} value={opt} onChange={(e) => updateOption(q.id, oi, e.target.value)} />
                      </label>
                    ))}
                  </div>
                  <QuestionImageField q={q} t={t} onPick={(f) => setQuestionImage(q.id, f)} onClear={() => clearQuestionImage(q.id)} />
                </div>
              ) : (
                <div className="hl-q-row">
                  <div className="hl-q-num">{i + 1}{q.type === "vertical" && <ClipboardList size={11} className="hl-q-vert-mark" />}</div>
                  <input className="hl-q-text" placeholder={t("questionPlaceholder")} value={q.text} onChange={(e) => updateQuestion(q.id, "text", e.target.value)} />
                  <input className="hl-q-answer" placeholder={t("answerPlaceholder")} value={q.answer} onChange={(e) => updateQuestion(q.id, "answer", e.target.value)} />
                  <input className="hl-q-points" type="number" min="0" placeholder={t("pointsPlaceholder")} value={q.points} onChange={(e) => updateQuestion(q.id, "points", e.target.value)} />
                  <button className="hl-icon-btn danger" onClick={() => removeQuestion(q.id)} disabled={questions.length === 1}><Trash2 size={15} /></button>
                  {q.type !== "vertical" && (
                    <div className="hl-q-photo-row">
                      <QuestionImageField q={q} t={t} onPick={(f) => setQuestionImage(q.id, f)} onClear={() => clearQuestionImage(q.id)} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hl-vbuilder">
          <div className="hl-q-head"><span><ClipboardList size={14} /> {t("vTitle")}</span></div>
          <div className="hl-vbuilder-row">
            <input className="hl-vb-num" type="number" placeholder={t("vOperand1")} value={vA} onChange={(e) => setVA(e.target.value)} />
            <select value={vOp} onChange={(e) => setVOp(e.target.value)}>
              <option value="add">{t("vAddition")} (+)</option>
              <option value="sub">{t("vSubtraction")} (−)</option>
              <option value="mul">{t("vMultiplication")} (×)</option>
              <option value="div">{t("vDivision")} (÷)</option>
            </select>
            <input className="hl-vb-num" type="number" placeholder={t("vOperand2")} value={vB} onChange={(e) => setVB(e.target.value)} />
            <input className="hl-vb-pts" type="number" min="0" placeholder={t("vPoints")} value={vPts} onChange={(e) => setVPts(e.target.value)} />
            <button className="hl-btn ghost sm" type="button" onClick={addVerticalQuestion}><Plus size={14} /> {t("vAdd")}</button>
          </div>
        </div>

        <button className="hl-btn primary" onClick={save}><Save size={15} /> {t("saveHomework")}</button>
      </div>

      <h3 className="hl-subhead">{t("recentlySet")}</h3>
      <div className="hl-hw-list">
        {grouped.length === 0 && <EmptyState text={t("noHomeworkYet")} />}
        {grouped.map((h) => (
          <div className="hl-hw-item" key={h.id}>
            <div className="hl-hw-date">
              <div className="hl-hw-date-day">{new Date(h.date + "T00:00:00").getDate()}</div>
              <div className="hl-hw-date-mon">{new Date(h.date + "T00:00:00").toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { month: "short" })}</div>
            </div>
            <div className="hl-hw-body">
              <div className="hl-hw-title">{h.title}</div>
              <div className="hl-hw-meta">{h.subject} · {h.className} · {t("questionsCount", { n: h.questions.length })}</div>
            </div>
            <button className="hl-icon-btn danger" onClick={() => removeHomework(h.id)}><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewScores({ api }) {
  const { homework, submissions, setSubmissions, users, t, lang } = api;
  const [selectedId, setSelectedId] = useState(homework[0]?.id || "");
  const [viewing, setViewing] = useState(null); // { student, sub }
  useEffect(() => { if (!selectedId && homework[0]) setSelectedId(homework[0].id); }, [homework]);
  const hw = homework.find((h) => h.id === selectedId);

  const studentsInClass = useMemo(() => {
    if (!hw) return [];
    return Object.entries(users)
      .filter(([, u]) => u.role === "student" && u.className === hw.className)
      .map(([id, u]) => ({ id, ...u }));
  }, [users, hw]);

  const rows = useMemo(() => {
    if (!hw) return [];
    return studentsInClass.map((s) => {
      const sub = submissions.find((x) => x.homeworkId === hw.id && x.studentId === s.id);
      return { student: s, sub };
    }).sort((a, b) => {
      if (!!a.sub === !!b.sub) return a.student.name.localeCompare(b.student.name);
      return a.sub ? -1 : 1;
    });
  }, [studentsInClass, submissions, hw]);

  const maxScore = hw ? hw.questions.reduce((s, q) => s + ptsOf(q), 0) : 0;
  const submittedCount = rows.filter((r) => r.sub).length;

  const gradeAnswer = async (sub, questionId, isCorrect) => {
    const q = hw.questions.find((qq) => qq.id === questionId);
    const nextAnswers = sub.answers.map((a) => (a.questionId === questionId ? { ...a, correct: isCorrect, ungraded: false } : a));
    const score = nextAnswers.reduce((s, a) => (a.correct ? s + ptsOf(hw.questions.find((qq) => qq.id === a.questionId) || {}) : s), 0);
    const nextSub = { ...sub, answers: nextAnswers, score };
    await setSubmissions(submissions.map((s) => (s.id === sub.id ? nextSub : s)));
    setViewing((v) => (v && v.sub.id === sub.id ? { ...v, sub: nextSub } : v));
  };

  return (
    <div className="hl-page">
      <PageHead icon={<BarChart3 size={20} />} title={t("rvTitle")} sub={t("rvSub")} />
      <div className="hl-card">
        <label className="hl-field">
          <span>{t("selectHomework")}</span>
          <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
            {homework.length === 0 && <option value="">{t("noHomeworkOption")}</option>}
            {[...homework].sort((a, b) => (a.date < b.date ? 1 : -1)).map((h) => (
              <option key={h.id} value={h.id}>{friendlyDate(h.date, lang)} — {h.title} ({h.className})</option>
            ))}
          </select>
        </label>

        {hw && (
          <>
            <div className="hl-stat-row">
              <div className="hl-stat"><span>{studentsInClass.length}</span>{t("studentsIn", { cls: hw.className })}</div>
              <div className="hl-stat"><span>{submittedCount}</span>{t("submitted")}</div>
              <div className="hl-stat"><span>{studentsInClass.length - submittedCount}</span>{t("pending")}</div>
              <div className="hl-stat"><span>{maxScore}</span>{t("maxScore")}</div>
            </div>

            <div className="hl-table-wrap">
              <table className="hl-table">
                <thead><tr><th>{t("colStudent")}</th><th>{t("colUserId")}</th><th>{t("colStatus")}</th><th>{t("colScore")}</th><th></th></tr></thead>
                <tbody>
                  {rows.map(({ student, sub }) => {
                    const hasUngraded = sub && sub.answers.some((a) => a.ungraded);
                    return (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td className="mono">{student.id}</td>
                        <td>
                          {sub ? <span className="hl-pill ok"><CheckCircle2 size={13} /> {t("statusSubmitted")}</span>
                               : <span className="hl-pill pending"><Circle size={13} /> {t("statusNotYet")}</span>}
                          {hasUngraded && <span className="hl-pill pending" style={{ marginLeft: 6 }}><ImageIcon size={12} /> {t("needsCheck")}</span>}
                        </td>
                        <td className="mono">{sub ? `${sub.score} / ${sub.maxScore}` : "—"}</td>
                        <td>
                          {sub && <button className="hl-icon-btn" title={t("viewAnswers")} onClick={() => setViewing({ student, sub })}><FileText size={15} /></button>}
                        </td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && <tr><td colSpan={5}><EmptyState text={t("noStudentsInClass")} /></td></tr>}
                </tbody>
              </table>
            </div>
          </>
        )}
        {!hw && homework.length === 0 && <EmptyState text={t("setHomeworkFirst")} />}
      </div>

      {viewing && hw && (
        <AnswerDetailModal
          hw={hw} student={viewing.student} sub={viewing.sub}
          onGrade={(qid, ok) => gradeAnswer(viewing.sub, qid, ok)}
          onClose={() => setViewing(null)} t={t}
        />
      )}
    </div>
  );
}

function AnswerDetailModal({ hw, student, sub, onGrade, onClose, t }) {
  const [zoomSrc, setZoomSrc] = useState(null);
  return (
    <div className="hl-modal-overlay" onClick={onClose}>
      <div className="hl-zoom-card" onClick={(e) => e.stopPropagation()}>
        <div className="hl-zoom-toolbar">
          <span className="hl-note-name">{student.name} · {sub.score}/{sub.maxScore}</span>
          <button className="hl-icon-btn" onClick={onClose} title={t("close")}><X size={16} /></button>
        </div>
        <div className="hl-profile-body">
          <div className="hl-result-list">
            {hw.questions.map((q) => {
              const d = sub.answers.find((a) => a.questionId === q.id);
              if (!d) return null;
              return (
                <div className={`hl-result-row ${d.ungraded ? "" : d.correct ? "ok" : "bad"}`} key={q.id}>
                  {d.ungraded ? <ImageIcon size={14} /> : d.correct ? <Check size={14} /> : <X size={14} />}
                  <div style={{ flex: 1 }}>
                    <div className="q">{q.text}</div>
                    <div className="a">
                      {d.given ? <>{t("yourAnswer")} {d.given}</> : null}
                      {!d.ungraded && !d.correct && <> · {t("correctLabel")} {q.answer}</>}
                    </div>
                    {d.givenImage && (
                      <button type="button" className="hl-q-solve-thumb" onClick={() => setZoomSrc(d.givenImage)}>
                        <img src={d.givenImage} alt="" />
                      </button>
                    )}
                    {d.ungraded && (
                      <div className="hl-row-actions" style={{ marginTop: 6 }}>
                        <button className="hl-btn ghost sm" onClick={() => onGrade(q.id, true)}><Check size={13} /> {t("markCorrect")}</button>
                        <button className="hl-btn ghost sm" onClick={() => onGrade(q.id, false)}><X size={13} /> {t("markIncorrect")}</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {zoomSrc && <ImageZoomModal src={zoomSrc} onClose={() => setZoomSrc(null)} t={t} />}
    </div>
  );
}

function ManageStudents({ api }) {
  const { users, setUsers, classes, showToast, t, confirm, prompt } = api;
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [cls, setCls] = useState(classes[0] || "");
  useEffect(() => { if (!cls && classes[0]) setCls(classes[0]); }, [classes]);

  const students = Object.entries(users).filter(([, u]) => u.role === "student").map(([sid, u]) => ({ id: sid, ...u }));

  const addStudent = async () => {
    const cleanId = id.trim();
    if (!name.trim() || !cleanId || !pw.trim() || !cls) { showToast(t("fillAllErr"), "err"); return; }
    if (users[cleanId]) { showToast(t("idTakenErr"), "err"); return; }
    await setUsers({ ...users, [cleanId]: { password: pw.trim(), role: "student", name: name.trim(), className: cls } });
    showToast(t("addedToast", { name: name.trim(), cls }));
    setName(""); setId(""); setPw("");
  };

  const removeStudent = async (sid) => {
    if (!(await confirm(t("removeStudentConfirm")))) return;
    const next = { ...users }; delete next[sid];
    await setUsers(next);
  };

  const resetPassword = async (sid) => {
    const np = await prompt(t("resetPwPrompt"));
    if (!np) return;
    await setUsers({ ...users, [sid]: { ...users[sid], password: np } });
    showToast(t("pwUpdated"));
  };

  const changeClass = async (sid, newClass) => {
    await setUsers({ ...users, [sid]: { ...users[sid], className: newClass } });
  };

  return (
    <div className="hl-page">
      <PageHead icon={<Users size={20} />} title={t("msTitle")} sub={t("msSub")} />
      <div className="hl-card">
        <div className="hl-grid-4">
          <label className="hl-field"><span>{t("fullName")}</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")} /></label>
          <label className="hl-field"><span>{t("userId")}</span><input value={id} onChange={(e) => setId(e.target.value)} placeholder={t("userIdPlaceholder")} /></label>
          <label className="hl-field"><span>{t("password")}</span><input value={pw} onChange={(e) => setPw(e.target.value)} placeholder={t("pwPlaceholder")} /></label>
          <label className="hl-field">
            <span>{t("class")}</span>
            <select value={cls} onChange={(e) => setCls(e.target.value)}>{classes.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          </label>
        </div>
        <button className="hl-btn primary" onClick={addStudent}><Plus size={15} /> {t("addStudent")}</button>
      </div>

      <div className="hl-table-wrap">
        <table className="hl-table">
          <thead><tr><th>{t("colName")}</th><th>{t("colUserId")}</th><th>{t("class")}</th><th></th></tr></thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td className="mono">{s.id}</td>
                <td>
                  <select value={s.className} onChange={(e) => changeClass(s.id, e.target.value)}>
                    {classes.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </td>
                <td className="hl-row-actions">
                  <button className="hl-icon-btn" title={t("resetPwPrompt")} onClick={() => resetPassword(s.id)}><KeyRound size={15} /></button>
                  <button className="hl-icon-btn danger" title={t("removeStudentConfirm")} onClick={() => removeStudent(s.id)}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {students.length === 0 && <tr><td colSpan={4}><EmptyState text={t("noStudentsYet")} /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManageSetup({ api }) {
  const { classes, setClasses, subjects, setSubjects, showToast, t, confirm } = api;
  const [newClass, setNewClass] = useState("");
  const [newSubject, setNewSubject] = useState("");

  const addClass = async () => {
    const v = newClass.trim();
    if (!v) return;
    if (classes.includes(v)) { showToast(t("classExistsErr"), "err"); return; }
    await setClasses([...classes, v]); setNewClass("");
  };
  const removeClass = async (c) => {
    if (!(await confirm(t("removeClassConfirm", { c })))) return;
    await setClasses(classes.filter((x) => x !== c));
  };
  const addSubject = async () => {
    const v = newSubject.trim();
    if (!v) return;
    if (subjects.includes(v)) { showToast(t("subjectExistsErr"), "err"); return; }
    await setSubjects([...subjects, v]); setNewSubject("");
  };
  const removeSubject = async (s) => {
    if (!(await confirm(t("removeSubjectConfirm", { s })))) return;
    await setSubjects(subjects.filter((x) => x !== s));
  };

  return (
    <div className="hl-page">
      <PageHead icon={<Layers size={20} />} title={t("stTitle")} sub={t("stSub")} />
      <div className="hl-grid-2">
        <div className="hl-card">
          <div className="hl-q-head"><span>{t("classesLabel")}</span></div>
          <div className="hl-chip-input">
            <input value={newClass} onChange={(e) => setNewClass(e.target.value)} placeholder={t("classPlaceholder")} onKeyDown={(e) => e.key === "Enter" && addClass()} />
            <button className="hl-btn primary sm" onClick={addClass}><Plus size={14} /> {t("add")}</button>
          </div>
          <div className="hl-chip-list">
            {classes.map((c) => (
              <span className="hl-chip" key={c}>{c}<button onClick={() => removeClass(c)}><X size={12} /></button></span>
            ))}
          </div>
        </div>
        <div className="hl-card">
          <div className="hl-q-head"><span>{t("subjectsLabel")}</span></div>
          <div className="hl-chip-input">
            <input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder={t("subjectPlaceholder")} onKeyDown={(e) => e.key === "Enter" && addSubject()} />
            <button className="hl-btn primary sm" onClick={addSubject}><Plus size={14} /> {t("add")}</button>
          </div>
          <div className="hl-chip-list">
            {subjects.map((s) => (
              <span className="hl-chip" key={s}>{s}<button onClick={() => removeSubject(s)}><X size={12} /></button></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= STUDENT =================
function StudentApp({ user, api, onLogout }) {
  const { t } = api;
  const [active, setActive] = useState("today");
  const tabs = [
    { key: "today", label: t("navToday"), icon: <Calendar size={18} /> },
    { key: "videos", label: t("navVideos"), icon: <VideoIcon size={18} /> },
    { key: "leaderboard", label: t("navLeaderboard"), icon: <Trophy size={18} /> },
  ];
  return (
    <Shell
      user={user} onLogout={onLogout} tabs={tabs} active={active} setActive={setActive}
      roleLabel={user.className} api={api}
      profileContent={<MyScores user={user} api={api} embedded />}
      profileLabel={t("navHistory")}
    >
      {active === "today" && <DayHomework user={user} api={api} />}
      {active === "videos" && <VideosManager api={api} />}
      {active === "leaderboard" && <Leaderboard api={api} highlightId={user.id} lockClass={user.className} />}
    </Shell>
  );
}

function DayHomework({ user, api }) {
  const { homework, submissions, reattempts, setSubmissions, setReattempts, showToast, t, lang, confirm } = api;
  const [anchor, setAnchor] = useState(TODAY_ISO);
  const [selected, setSelected] = useState(TODAY_ISO);
  const [solving, setSolving] = useState(null); // { hw, mode: "new" | "reattempt" }

  const myHomework = useMemo(() => homework.filter((h) => h.className === user.className), [homework, user.className]);
  const days = weekStrip(anchor);
  const dayHasHw = (iso) => myHomework.some((h) => h.date === iso);
  const dayNames = DAY_NAMES[lang] || DAY_NAMES.en;

  const forSelected = myHomework.filter((h) => h.date === selected);
  const subFor = (hwId) => submissions.find((s) => s.homeworkId === hwId && s.studentId === user.id);

  const otherDates = useMemo(() => {
    const set = new Set(myHomework.map((h) => h.date));
    days.forEach((d) => set.delete(d));
    return [...set].sort((a, b) => (a < b ? 1 : -1));
  }, [myHomework, days]);

  if (solving) {
    return (
      <SolveHomework
        hw={solving.hw} mode={solving.mode} user={user}
        submissions={submissions} setSubmissions={setSubmissions}
        reattempts={reattempts} setReattempts={setReattempts}
        showToast={showToast} onDone={() => setSolving(null)} t={t} confirm={confirm}
      />
    );
  }

  return (
    <div className="hl-page">
      <PageHead icon={<Calendar size={20} />} title={t("dhTitle")} sub={t("dhSub", { cls: user.className })} />

      <>
          <div className="hl-week-strip">
            <button className="hl-icon-btn" onClick={() => { const d = new Date(anchor + "T00:00:00"); d.setDate(d.getDate() - 7); setAnchor(isoDate(d)); }}><ChevronLeft size={16} /></button>
            {days.map((iso, i) => (
              <button key={iso} className={`hl-day ${selected === iso ? "active" : ""} ${iso === TODAY_ISO ? "today" : ""}`} onClick={() => setSelected(iso)}>
                <div className="hl-day-name">{dayNames[i]}</div>
                <div className="hl-day-num">{new Date(iso + "T00:00:00").getDate()}</div>
                {dayHasHw(iso) && <div className="hl-day-dot" />}
              </button>
            ))}
            <button className="hl-icon-btn" onClick={() => { const d = new Date(anchor + "T00:00:00"); d.setDate(d.getDate() + 7); setAnchor(isoDate(d)); }}><ChevronRight size={16} /></button>
          </div>

          {otherDates.length > 0 && (
            <label className="hl-field hl-jump">
              <span>{t("jumpLabel")}</span>
              <select value="" onChange={(e) => e.target.value && setSelected(e.target.value)}>
                <option value="">{t("selectDatePlaceholder")}</option>
                {otherDates.map((d) => <option key={d} value={d}>{friendlyDate(d, lang)}</option>)}
              </select>
            </label>
          )}

          <h3 className="hl-subhead">{friendlyDate(selected, lang)}{selected === TODAY_ISO ? ` · ${t("today")}` : ""}</h3>
          <div className="hl-hw-list">
            {forSelected.length === 0 && <EmptyState text={t("noHomeworkForDay")} />}
            {forSelected.map((h) => {
              const sub = subFor(h.id);
              const maxScore = h.questions.reduce((s, q) => s + ptsOf(q), 0);
              const locked = h.date > TODAY_ISO;
              return (
                <div className="hl-hw-item" key={h.id}>
                  <div className="hl-subject-badge">{h.subject}</div>
                  <div className="hl-hw-body">
                    <div className="hl-hw-title">{h.title}</div>
                    <div className="hl-hw-meta">{t("questionsCount", { n: h.questions.length })} · {maxScore} {t("pointsWord")}</div>
                  </div>
                  {locked ? (
                    <div className="hl-pill locked" title={t("availableOn", { date: friendlyDate(h.date, lang) })}><Lock size={13} /> {t("lockedHw")}</div>
                  ) : sub ? (
                    <div className="hl-hw-done">
                      <div className="hl-score-badge">{sub.score}/{sub.maxScore}</div>
                      <button className="hl-btn ghost sm" onClick={() => setSolving({ hw: h, mode: "reattempt" })}><RotateCcw size={13} /> {t("reattempt")}</button>
                    </div>
                  ) : (
                    <button className="hl-btn primary sm" onClick={() => setSolving({ hw: h, mode: "new" })}><Pencil size={14} /> {t("solve")}</button>
                  )}
                </div>
              );
            })}
          </div>
      </>
    </div>
  );
}

function SolveHomework({ hw, mode = "new", user, submissions, setSubmissions, reattempts, setReattempts, showToast, onDone, t, confirm }) {
  const [answers, setAnswers] = useState({});
  const [answerImages, setAnswerImages] = useState({});
  const [zoomSrc, setZoomSrc] = useState(null);
  const [result, setResult] = useState(null);
  const isReattempt = mode === "reattempt";

  const setPhotoAnswer = async (qid, file) => {
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setAnswerImages((a) => ({ ...a, [qid]: dataUrl }));
    } catch (e) { showToast(t("noteUploadErr"), "err"); }
  };
  const clearPhotoAnswer = (qid) => setAnswerImages((a) => { const n = { ...a }; delete n[qid]; return n; });

  const submit = async () => {
    const unanswered = hw.questions.filter((q) => !normalize(answers[q.id]) && !answerImages[q.id]);
    if (unanswered.length > 0 && !(await confirm(t("blankConfirm", { n: unanswered.length })))) return;

    let score = 0;
    const maxScore = hw.questions.reduce((s, q) => s + ptsOf(q), 0);
    const detail = hw.questions.map((q) => {
      const given = answers[q.id] || "";
      const hasImage = !!answerImages[q.id];
      const correct = given ? answersMatch(given, q.answer) : false;
      if (correct) score += ptsOf(q);
      return { questionId: q.id, given, ...(hasImage ? { givenImage: answerImages[q.id] } : {}), correct, ungraded: !given && hasImage };
    });

    const entry = {
      id: uid(isReattempt ? "re" : "sub"), homeworkId: hw.id, studentId: user.id,
      answers: detail, score, maxScore, submittedAt: Date.now(),
    };
    if (isReattempt) {
      await setReattempts([entry, ...reattempts]);
    } else {
      await setSubmissions([...submissions.filter((s) => !(s.homeworkId === hw.id && s.studentId === user.id)), entry]);
    }
    setResult(entry);
    showToast(t("submittedToast", { score, max: maxScore }));
  };

  if (result) {
    return (
      <div className="hl-page">
        <div className="hl-result-card">
          <Trophy size={30} />
          <div className="hl-result-score">{result.score} / {result.maxScore}</div>
          <div className="hl-result-title">{isReattempt ? t("reattemptOf", { title: hw.title }) : hw.title}</div>
          {isReattempt && <p className="hl-reattempt-note">{t("reattemptNote")}</p>}
          <div className="hl-result-list">
            {hw.questions.map((q) => {
              const d = result.answers.find((a) => a.questionId === q.id);
              return (
                <div className={`hl-result-row ${d.ungraded ? "" : d.correct ? "ok" : "bad"}`} key={q.id}>
                  {d.ungraded ? <ImageIcon size={14} /> : d.correct ? <Check size={14} /> : <X size={14} />}
                  <span className="q">{q.text}</span>
                  <span className="a">
                    {d.ungraded ? t("photoAnswerNote") : <>{t("yourAnswer")} {d.given || "—"}{!d.correct && <> · {t("correctLabel")} {q.answer}</>}</>}
                  </span>
                </div>
              );
            })}
          </div>
          <button className="hl-btn primary" onClick={onDone}>{t("backToList")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="hl-page">
      <PageHead icon={isReattempt ? <RotateCcw size={20} /> : <Pencil size={20} />} title={isReattempt ? t("reattemptOf", { title: hw.title }) : hw.title} sub={`${hw.subject} · ${hw.className}`} />
      {isReattempt && <p className="hl-reattempt-note">{t("reattemptNote")}</p>}
      <div className="hl-card">
        {hw.questions.map((q, i) => (
          <div className="hl-solve-q" key={q.id}>
            {q.type === "vertical" ? (
              <>
                <div className="hl-solve-q-head"><span className="hl-solve-num">{i + 1}</span> <span className="hl-pts">({q.points} {t("pointsWord")})</span></div>
                <div className="hl-vertical-problem">
                  <div className="hl-vert-num">{q.a}</div>
                  <div className="hl-vert-op-row"><span className="hl-vert-op">{OP_SYMBOLS[q.op]}</span><span className="hl-vert-num">{q.b}</span></div>
                  <div className="hl-vert-line" />
                  <input className="hl-vert-answer" placeholder={t("vAnswerPlaceholder")} value={answers[q.id] || ""} onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))} />
                </div>
              </>
            ) : q.type === "mcq" ? (
              <>
                <div className="hl-solve-q-head"><span className="hl-solve-num">{i + 1}</span>{q.text} <span className="hl-pts">({q.points} {t("pointsWord")})</span></div>
                {q.image && (
                  <button type="button" className="hl-q-solve-thumb" onClick={() => setZoomSrc(q.image)}>
                    <img src={q.image} alt="" />
                  </button>
                )}
                <div className="hl-mcq-options solve">
                  {q.options.map((opt, oi) => (
                    <label className="hl-mcq-option" key={oi}>
                      <input type="radio" name={`ans-${q.id}`} checked={answers[q.id] === opt} onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))} />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="hl-solve-q-head"><span className="hl-solve-num">{i + 1}</span>{q.text} <span className="hl-pts">({q.points} {t("pointsWord")})</span></div>
                {q.image && (
                  <button type="button" className="hl-q-solve-thumb" onClick={() => setZoomSrc(q.image)}>
                    <img src={q.image} alt="" />
                  </button>
                )}
                <input placeholder={t("typeAnswerPlaceholder")} value={answers[q.id] || ""} onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))} />
                <div className="hl-q-photo">
                  {answerImages[q.id] ? (
                    <div className="hl-q-photo-preview">
                      <img src={answerImages[q.id]} alt="" />
                      <button type="button" className="hl-icon-btn danger sm" onClick={() => clearPhotoAnswer(q.id)}><Trash2 size={13} /></button>
                    </div>
                  ) : (
                    <label className="hl-btn ghost sm hl-upload-btn">
                      <ImageIcon size={14} /> {t("answerWithPhoto")}
                      <input type="file" accept="image/*" hidden onChange={(e) => { setPhotoAnswer(q.id, e.target.files && e.target.files[0]); e.target.value = ""; }} />
                    </label>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        <div className="hl-row-actions gap">
          <button className="hl-btn ghost" onClick={onDone}>{t("cancel")}</button>
          <button className="hl-btn primary" onClick={submit}><Save size={15} /> {t("submitHomework")}</button>
        </div>
      </div>
      {zoomSrc && <ImageZoomModal src={zoomSrc} onClose={() => setZoomSrc(null)} t={t} />}
    </div>
  );
}

function MyScores({ user, api, embedded }) {
  const { homework, submissions, reattempts, t, lang } = api;
  const mine = submissions.filter((s) => s.studentId === user.id)
    .map((s) => ({ ...s, hw: homework.find((h) => h.id === s.homeworkId) }))
    .filter((s) => s.hw)
    .sort((a, b) => b.submittedAt - a.submittedAt);

  const myReattempts = reattempts.filter((s) => s.studentId === user.id)
    .map((s) => ({ ...s, hw: homework.find((h) => h.id === s.homeworkId) }))
    .filter((s) => s.hw)
    .sort((a, b) => b.submittedAt - a.submittedAt);

  const totalScore = mine.reduce((s, m) => s + m.score, 0);
  const totalMax = mine.reduce((s, m) => s + m.maxScore, 0);
  const pct = totalMax ? Math.round((totalScore / totalMax) * 100) : 0;

  const body = (
    <>
      <div className="hl-stat-row">
        <div className="hl-stat"><span>{mine.length}</span>{t("statSubmitted")}</div>
        <div className="hl-stat"><span>{totalScore}/{totalMax}</span>{t("statTotalPoints")}</div>
        <div className="hl-stat"><span>{pct}%</span>{t("statAccuracy")}</div>
      </div>
      <div className="hl-table-wrap">
        <table className="hl-table">
          <thead><tr><th>{t("colDate")}</th><th>{t("colSubject")}</th><th>{t("colHomework")}</th><th>{t("colScore")}</th></tr></thead>
          <tbody>
            {mine.map((m) => (
              <tr key={m.id}>
                <td>{friendlyDate(m.hw.date, lang)}</td>
                <td>{m.hw.subject}</td>
                <td>{m.hw.title}</td>
                <td className="mono">{m.score}/{m.maxScore}</td>
              </tr>
            ))}
            {mine.length === 0 && <tr><td colSpan={4}><EmptyState text={t("noSubmissions")} /></td></tr>}
          </tbody>
        </table>
      </div>

      <h3 className="hl-subhead">{t("reattemptSection")}</h3>
      <p className="hl-reattempt-note">{t("reattemptNote")}</p>
      <div className="hl-table-wrap">
        <table className="hl-table">
          <thead><tr><th>{t("colDate")}</th><th>{t("colSubject")}</th><th>{t("colHomework")}</th><th>{t("colScore")}</th></tr></thead>
          <tbody>
            {myReattempts.map((m) => (
              <tr key={m.id}>
                <td>{friendlyDate(m.hw.date, lang)}</td>
                <td>{m.hw.subject}</td>
                <td>{m.hw.title}</td>
                <td className="mono">{m.score}/{m.maxScore}</td>
              </tr>
            ))}
            {myReattempts.length === 0 && <tr><td colSpan={4}><EmptyState text={t("noReattempts")} /></td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );

  if (embedded) return <div className="hl-embedded-section">{body}</div>;

  return (
    <div className="hl-page">
      <PageHead icon={<BarChart3 size={20} />} title={t("msrTitle")} sub={t("msrSub")} />
      {body}
    </div>
  );
}

// ---------- LEADERBOARD (shared) ----------
function Leaderboard({ api, highlightId, lockClass, embedded }) {
  const { users, submissions, classes, t } = api;
  const [clsFilter, setClsFilter] = useState(lockClass || "all");
  const effectiveFilter = lockClass || clsFilter;

  const rows = useMemo(() => {
    const students = Object.entries(users).filter(([, u]) => u.role === "student")
      .filter(([, u]) => effectiveFilter === "all" || u.className === effectiveFilter);
    return students.map(([id, u]) => {
      const subs = submissions.filter((s) => s.studentId === id);
      const score = subs.reduce((a, s) => a + s.score, 0);
      const max = subs.reduce((a, s) => a + s.maxScore, 0);
      return { id, name: u.name, className: u.className, score, max, count: subs.length };
    }).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  }, [users, submissions, effectiveFilter]);

  const medal = (i) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;

  const body = (
    <>
      {!lockClass && (
        <label className="hl-field hl-jump">
          <span>{t("filterLabel")}</span>
          <select value={clsFilter} onChange={(e) => setClsFilter(e.target.value)}>
            <option value="all">{t("allClasses")}</option>
            {classes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      )}

      <div className="hl-ledger">
        <div className="hl-ledger-head">
          <span>{t("headRank")}</span><span>{t("headStudent")}</span><span>{t("headClass")}</span><span>{t("headDone")}</span><span>{t("headPoints")}</span>
        </div>
        {rows.map((r, i) => {
          const pct = r.max ? Math.round((r.score / r.max) * 100) : 0;
          return (
            <div className={`hl-ledger-row ${r.id === highlightId ? "me" : ""}`} key={r.id}>
              <span className="hl-rank">{medal(i) || i + 1}</span>
              <span className="hl-lname">{r.name}{r.id === highlightId && <em>{t("youSuffix")}</em>}</span>
              <span>{r.className}</span>
              <span className="mono">{r.count}</span>
              <span className="hl-points">
                <span className="mono">{r.score} {t("ptsWord")}</span>
                <span className="hl-bar"><span style={{ width: `${pct}%` }} /></span>
              </span>
            </div>
          );
        })}
        {rows.length === 0 && <EmptyState text={t("noScoresYet")} />}
      </div>
    </>
  );

  if (embedded) return <div className="hl-embedded-section">{body}</div>;

  return (
    <div className="hl-page">
      <PageHead icon={<Trophy size={20} />} title={t("lbTitle")} sub={t("lbSub")} />
      {body}
    </div>
  );
}

// ---------- NOTES (photos & PDFs) ----------
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error("read failed"));
    r.readAsDataURL(file);
  });
}

// ---------- photo attach field (used when a teacher sets a question) ----------
function QuestionImageField({ q, t, onPick, onClear }) {
  return (
    <div className="hl-q-photo">
      {q.image ? (
        <div className="hl-q-photo-preview">
          <img src={q.image} alt="" />
          <button type="button" className="hl-icon-btn danger sm" onClick={onClear}><Trash2 size={13} /></button>
        </div>
      ) : (
        <label className="hl-btn ghost sm hl-upload-btn">
          <ImageIcon size={14} /> {t("addPhoto")}
          <input type="file" accept="image/*" hidden onChange={(e) => { onPick(e.target.files && e.target.files[0]); e.target.value = ""; }} />
        </label>
      )}
    </div>
  );
}

function ImageZoomModal({ src, onClose, t }) {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="hl-modal-overlay" onClick={onClose}>
      <div className="hl-zoom-card" onClick={(e) => e.stopPropagation()}>
        <div className="hl-zoom-toolbar">
          <div className="hl-row-actions">
            <button className="hl-icon-btn" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} title={t("zoomOut")}><ZoomOut size={16} /></button>
            <button className="hl-icon-btn" onClick={() => setZoom((z) => Math.min(4, z + 0.5))} title={t("zoomIn")}><ZoomIn size={16} /></button>
          </div>
          <button className="hl-icon-btn" onClick={onClose} title={t("close")}><X size={16} /></button>
        </div>
        <div className="hl-zoom-body">
          <img src={src} alt="" style={{ transform: `scale(${zoom})` }} />
        </div>
      </div>
    </div>
  );
}

// ---------- VIDEOS (YouTube) ----------
function VideosManager({ api, isTeacher }) {
  const { videos, setVideos, showToast, t, confirm } = api;
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const addVideo = async () => {
    const ytId = parseYoutubeId(url);
    if (!ytId) { showToast(t("invalidYoutubeUrl"), "err"); return; }
    const entry = { id: uid("vid"), title: title.trim() || t("videosTitle"), youtubeId: ytId, addedAt: Date.now() };
    await setVideos([...videos, entry]);
    showToast(t("videoAdded", { n: entry.title }));
    setTitle(""); setUrl("");
  };

  const removeVideo = async (v) => {
    if (!(await confirm(t("removeVideoConfirm", { n: v.title })))) return;
    await setVideos(videos.filter((x) => x.id !== v.id));
  };

  const move = async (idx, dir) => {
    const next = [...videos];
    const swapWith = idx + dir;
    if (swapWith < 0 || swapWith >= next.length) return;
    [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
    await setVideos(next);
  };

  return (
    <div className="hl-page">
      <PageHead icon={<VideoIcon size={20} />} title={t("videosTitle")} sub={isTeacher ? t("videosSubTeacher") : t("videosSub")} />

      {isTeacher && (
        <div className="hl-card">
          <div className="hl-grid-2">
            <label className="hl-field"><span>{t("hwTitle")}</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("videoTitlePlaceholder")} /></label>
            <label className="hl-field"><span><Youtube size={13} /> {t("addVideo")}</span><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t("videoUrlPlaceholder")} /></label>
          </div>
          <button className="hl-btn primary" onClick={addVideo}><Plus size={15} /> {t("addVideo")}</button>
        </div>
      )}

      <div className="hl-video-list">
        {videos.length === 0 && <EmptyState text={t("noVideosYet")} />}
        {videos.map((v, i) => (
          <div className="hl-video-card" key={v.id}>
            <div className="hl-video-embed">
              <iframe
                src={`https://www.youtube.com/embed/${v.youtubeId}`}
                title={v.title} allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            <div className="hl-video-foot">
              <div className="hl-hw-title">{v.title}</div>
              {isTeacher && (
                <div className="hl-row-actions">
                  <button className="hl-icon-btn" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={14} /></button>
                  <button className="hl-icon-btn" disabled={i === videos.length - 1} onClick={() => move(i, 1)}><ArrowDown size={14} /></button>
                  <button className="hl-icon-btn danger" onClick={() => removeVideo(v)}><Trash2 size={14} /></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- small ui bits ----------
function PageHead({ icon, title, sub }) {
  return (
    <div className="hl-page-head">
      <div className="hl-page-icon">{icon}</div>
      <div>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
    </div>
  );
}
function EmptyState({ text }) {
  return <div className="hl-empty"><Circle size={16} /> {text}</div>;
}

// ---------- styles ----------
function Style() {
  return (
    <style>{`
      .hl-root {
        --paper: #FAFAF9;
        --paper-line: #ECEAE7;
        --margin: #FF6719;
        --ink: #1A1A1A;
        --ink-soft: #4B5563;
        --board: #FF6719;
        --board-dark: #E64E0A;
        --board-tint: #FFF1E7;
        --gradient: linear-gradient(135deg, #FF7A33 0%, #FF4D0A 100%);
        --gold: #FF6719;
        --gold-dark: #E64E0A;
        --coral: #DC2626;
        --success: #16A34A;
        --card: #FFFFFF;
        --border: #E8E6E3;
        font-family: 'Inter', 'Noto Sans Devanagari', 'Nirmala UI', 'Mangal', sans-serif;
        color: var(--ink);
        min-height: 100vh;
        background: linear-gradient(180deg, #FFF6F0 0%, #FFFFFF 220px, #FFFFFF 100%);
        position: relative;
        -webkit-tap-highlight-color: transparent;
      }
      .hl-root * { box-sizing: border-box; }
      .mono { font-family: 'JetBrains Mono', monospace; }
      .spin { animation: hlspin 1s linear infinite; }
      @keyframes hlspin { to { transform: rotate(360deg); } }

      .hl-boot { min-height: 100vh; display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--board); font-weight: 600; }

      /* Login */
      .hl-login-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; z-index: 1; }
      .hl-login-card { width: 100%; max-width: 400px; background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; box-shadow: 0 8px 24px rgba(20,20,20,0.07); }
      .hl-login-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 20px; }
      .hl-brand { display: flex; align-items: center; gap: 12px; }
      .hl-brand-mark { width: 42px; height: 42px; border-radius: 11px; background: var(--gradient); color: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .hl-brand-title { font-family: 'Inter', 'Noto Sans Devanagari', 'Nirmala UI', 'Mangal', sans-serif; font-weight: 800; font-size: 19px; color: var(--board-dark); letter-spacing: -0.2px; line-height: 1.2; }
      .hl-brand-title.small { font-size: 15px; }
      .hl-brand-title.small.truncate { max-width: 58vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13.5px; }
      .hl-brand-sub { font-size: 12px; color: var(--ink-soft); margin-top: 1px; }
      .hl-brand-sub.small { font-size: 10.5px; }
      .hl-brand.small { display: flex; align-items: center; gap: 10px; }

      .hl-lang-toggle { display: inline-flex; align-items: center; gap: 5px; border: 1px solid var(--border); background: var(--paper); color: var(--ink); font-weight: 700; font-size: 12px; padding: 8px 11px; border-radius: 20px; cursor: pointer; font-family: inherit; flex-shrink: 0; min-height: 36px; }
      .hl-lang-toggle:hover { background: #fff; }
      .hl-lang-toggle.compact { padding: 7px 9px; font-size: 11px; }

      .hl-role-toggle { display: flex; background: var(--paper); border: 1px solid var(--border); border-radius: 10px; padding: 3px; margin-bottom: 18px; }
      .hl-role-toggle button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px; border: none; background: transparent; border-radius: 8px; font-weight: 600; font-size: 13.5px; color: var(--ink-soft); cursor: pointer; min-height: 44px; }
      .hl-role-toggle button.active { background: var(--board); color: #FFFFFF; }

      .hl-form { display: flex; flex-direction: column; gap: 13px; }
      .hl-field { display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; font-weight: 600; color: var(--ink-soft); }
      .hl-field span { display: flex; align-items: center; gap: 5px; }
      .hl-field input, .hl-field select { border: 1px solid var(--border); background: var(--paper); border-radius: 9px; padding: 11px; font-size: 16px; color: var(--ink); font-family: inherit; min-height: 44px; width: 100%; }
      .hl-field input:focus, .hl-field select:focus { outline: 2px solid var(--gold); outline-offset: 0; border-color: var(--gold); }

      .hl-error { display: flex; align-items: flex-start; gap: 6px; font-size: 12.5px; color: var(--coral); background: #FBEAE6; border: 1px solid #EFC7BC; padding: 9px 10px; border-radius: 8px; line-height: 1.4; }

      .hl-btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; border: 1px solid transparent; border-radius: 9px; padding: 12px 16px; font-weight: 600; font-size: 14px; cursor: pointer; font-family: inherit; min-height: 44px; }
      .hl-btn.primary { background: var(--gradient); color: #FFFFFF; }
      .hl-btn.primary:hover { background: linear-gradient(135deg, #E4530C 0%, #E4382A 100%); }
      .hl-btn.ghost { background: transparent; border-color: var(--border); color: var(--ink); }
      .hl-btn.ghost:hover { background: var(--paper); }
      .hl-btn.wide { width: 100%; }
      .hl-btn.sm { padding: 8px 12px; font-size: 12.5px; min-height: 38px; }

      .hl-demo { margin-top: 20px; padding-top: 16px; border-top: 1px dashed var(--border); font-size: 12px; }
      .hl-demo-title { font-weight: 700; color: var(--board-dark); margin-bottom: 6px; font-family: 'Inter', 'Noto Sans Devanagari', 'Nirmala UI', 'Mangal', sans-serif; }
      .hl-demo-row { color: var(--ink-soft); margin-bottom: 2px; }
      .hl-demo-note { color: var(--ink-soft); margin-top: 8px; line-height: 1.5; }
      .hl-reset-link { display: inline-block; margin-top: 10px; background: none; border: none; padding: 4px 0; color: var(--gold-dark); font-size: 12px; font-weight: 700; text-decoration: underline; cursor: pointer; font-family: inherit; }

      /* Shell */
      .hl-shell { display: flex; min-height: 100vh; position: relative; z-index: 1; }
      .hl-topbar { display: none; }
      .hl-side { width: 232px; flex-shrink: 0; background: var(--card); border-right: 1px solid var(--border); display: flex; flex-direction: column; }
      .hl-side .hl-brand { padding: 18px 16px 14px; border-bottom: 1px solid var(--border); margin-bottom: 8px; }
      .hl-nav { display: flex; flex-direction: column; padding: 6px 12px; gap: 3px; flex: 1; }
      .hl-nav button { display: flex; align-items: center; gap: 10px; padding: 11px 12px; border: none; background: transparent; border-radius: 9px; font-weight: 600; font-size: 13.5px; color: var(--ink-soft); cursor: pointer; text-align: left; min-height: 44px; }
      .hl-nav button:hover { background: var(--paper); color: var(--ink); }
      .hl-nav button.active { background: var(--board-tint); color: var(--board-dark); }
      .hl-side-footer { padding: 14px 16px 16px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 10px; }
      .hl-user-chip { display: flex; align-items: center; gap: 9px; }
      .hl-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--gradient); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: 'Inter', 'Noto Sans Devanagari', 'Nirmala UI', 'Mangal', sans-serif; flex-shrink: 0; }
      .hl-avatar.sm { width: 28px; height: 28px; font-size: 13px; }
      .hl-user-name { font-size: 13px; font-weight: 700; color: var(--ink); }
      .hl-user-sub { font-size: 11px; color: var(--ink-soft); }
      .hl-main { flex: 1; padding: 30px 34px 60px; max-width: 980px; min-width: 0; }

      .hl-bottom-nav { display: none; }

      .hl-page-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 20px; }
      .hl-page-icon { width: 30px; height: 30px; border-radius: 9px; background: transparent; border: 1.5px solid var(--gold); color: var(--gold-dark); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .hl-page-head h2 { font-family: 'Inter', 'Noto Sans Devanagari', 'Nirmala UI', 'Mangal', sans-serif; font-size: 20px; font-weight: 800; color: var(--board-dark); margin: 0 0 2px; line-height: 1.25; }
      .hl-page-head p { font-size: 13px; color: var(--ink-soft); margin: 0; line-height: 1.4; }
      .hl-subhead { font-family: 'Inter', 'Noto Sans Devanagari', 'Nirmala UI', 'Mangal', sans-serif; font-size: 15px; font-weight: 700; color: var(--board-dark); margin: 24px 0 10px; }

      .hl-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 18px; display: flex; flex-direction: column; gap: 14px; margin-bottom: 6px; }
      .hl-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .hl-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
      .hl-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

      .hl-q-list { display: flex; flex-direction: column; gap: 10px; }
      .hl-q-head { display: flex; align-items: center; justify-content: space-between; font-size: 12.5px; font-weight: 700; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.03em; gap: 8px; }
      .hl-q-row { display: grid; grid-template-columns: 26px 1fr 140px 60px 40px; gap: 8px; align-items: center; }
      .hl-q-num { width: 24px; height: 24px; border-radius: 50%; background: var(--paper); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: var(--ink-soft); }
      .hl-q-row input { border: 1px solid var(--border); background: var(--paper); border-radius: 8px; padding: 10px; font-size: 15px; font-family: inherit; min-height: 42px; }

      .hl-icon-btn { width: 40px; height: 40px; border-radius: 9px; border: 1px solid var(--border); background: var(--paper); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--ink-soft); flex-shrink: 0; }
      .hl-icon-btn:hover { background: #fff; }
      .hl-icon-btn.danger { color: var(--coral); }
      .hl-icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }

      .hl-hw-list { display: flex; flex-direction: column; gap: 8px; }
      .hl-hw-item { display: flex; align-items: center; gap: 14px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; }
      .hl-hw-date { width: 44px; text-align: center; flex-shrink: 0; }
      .hl-hw-date-day { font-family: 'Inter', 'Noto Sans Devanagari', 'Nirmala UI', 'Mangal', sans-serif; font-weight: 800; font-size: 18px; color: var(--board-dark); line-height: 1; }
      .hl-hw-date-mon { font-size: 10px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.04em; }
      .hl-subject-badge { background: var(--board-tint); color: var(--board-dark); font-size: 11px; font-weight: 700; padding: 5px 9px; border-radius: 7px; flex-shrink: 0; }
      .hl-hw-body { flex: 1; min-width: 0; }
      .hl-hw-title { font-weight: 700; font-size: 14px; color: var(--ink); line-height: 1.35; }
      .hl-hw-meta { font-size: 12px; color: var(--ink-soft); margin-top: 2px; }
      .hl-score-badge { font-family: 'JetBrains Mono', monospace; font-weight: 600; font-size: 13px; background: #E7F1EA; color: var(--success); padding: 6px 11px; border-radius: 8px; flex-shrink: 0; }

      .hl-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 12px; }
      .hl-table { width: 100%; min-width: 460px; border-collapse: collapse; background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
      .hl-table th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ink-soft); background: var(--paper); padding: 10px 14px; border-bottom: 1px solid var(--border); white-space: nowrap; }
      .hl-table td { padding: 11px 14px; border-bottom: 1px solid var(--border); font-size: 13.5px; }
      .hl-table tr:last-child td { border-bottom: none; }
      .hl-table select { min-height: 38px; font-size: 13.5px; }
      .hl-row-actions { display: flex; gap: 6px; }
      .hl-row-actions.gap { justify-content: flex-end; gap: 10px; margin-top: 4px; }

      .hl-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; padding: 5px 9px; border-radius: 20px; white-space: nowrap; }
      .hl-pill.ok { background: #E7F1EA; color: var(--success); }
      .hl-pill.pending { background: #F2ECD9; color: #8A6B21; }

      .hl-stat-row { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
      .hl-stat { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; font-size: 11.5px; color: var(--ink-soft); font-weight: 600; min-width: 100px; flex: 1 1 100px; min-height: 72px; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
      .hl-stat span { display: block; font-family: 'Inter', 'Noto Sans Devanagari', 'Nirmala UI', 'Mangal', sans-serif; font-size: 20px; font-weight: 800; color: var(--board-dark); line-height: 1; font-variant-numeric: tabular-nums; }

      .hl-chip-input { display: flex; gap: 8px; }
      .hl-chip-input input { flex: 1; border: 1px solid var(--border); background: var(--paper); border-radius: 9px; padding: 10px 11px; font-size: 15px; font-family: inherit; min-height: 42px; min-width: 0; }
      .hl-chip-list { display: flex; flex-wrap: wrap; gap: 8px; }
      .hl-chip { display: inline-flex; align-items: center; gap: 7px; background: var(--paper); border: 1px solid var(--border); padding: 7px 11px; border-radius: 20px; font-size: 12.5px; font-weight: 600; }
      .hl-chip button { border: none; background: transparent; color: var(--ink-soft); cursor: pointer; display: flex; padding: 2px; }

      /* week strip */
      .hl-week-strip { display: flex; align-items: center; gap: 4px; background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 8px; margin-bottom: 14px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .hl-day { flex: 1; min-width: 42px; border: 1px solid transparent; background: transparent; border-radius: 10px; padding: 8px 3px; display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: pointer; position: relative; min-height: 52px; }
      .hl-day-name { font-size: 9.5px; color: var(--ink-soft); font-weight: 700; text-transform: uppercase; }
      .hl-day-num { font-family: 'Inter', 'Noto Sans Devanagari', 'Nirmala UI', 'Mangal', sans-serif; font-weight: 800; font-size: 15px; color: var(--ink); }
      .hl-day.today { border-color: var(--gold); }
      .hl-day.active { background: var(--gradient); }
      .hl-day.active .hl-day-name, .hl-day.active .hl-day-num { color: #FFFFFF; }
      .hl-day-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold-dark); position: absolute; bottom: 4px; }
      .hl-day.active .hl-day-dot { background: #FFFFFF; }
      .hl-jump { max-width: 340px; margin-bottom: 6px; }

      .hl-solve-q { display: flex; flex-direction: column; gap: 8px; padding-bottom: 16px; border-bottom: 1px dashed var(--border); }
      .hl-solve-q:last-of-type { border-bottom: none; }
      .hl-solve-q-head { font-weight: 600; font-size: 14.5px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; line-height: 1.4; }
      .hl-solve-num { width: 22px; height: 22px; border-radius: 50%; background: var(--paper); border: 1px solid var(--border); display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: var(--ink-soft); flex-shrink: 0; }
      .hl-pts { font-size: 11px; color: var(--ink-soft); font-weight: 500; }
      .hl-solve-q input { border: 1px solid var(--border); background: var(--paper); border-radius: 9px; padding: 11px; font-size: 16px; font-family: inherit; min-height: 44px; }

      .hl-result-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--gold-dark); }
      .hl-result-score { font-family: 'Inter', 'Noto Sans Devanagari', 'Nirmala UI', 'Mangal', sans-serif; font-size: 32px; font-weight: 800; color: var(--board-dark); margin-top: 4px; }
      .hl-result-title { font-size: 13px; color: var(--ink-soft); margin-bottom: 14px; }
      .hl-result-list { width: 100%; text-align: left; display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
      .hl-result-row { display: flex; gap: 8px; align-items: flex-start; font-size: 12.5px; padding: 9px 10px; border-radius: 8px; line-height: 1.4; }
      .hl-result-row.ok { background: #E7F1EA; color: #2E5E42; }
      .hl-result-row.bad { background: #FBEAE6; color: #8A392A; }
      .hl-result-row .q { font-weight: 600; }
      .hl-result-row .a { color: inherit; opacity: 0.85; }

      /* ledger / leaderboard */
      .hl-ledger { background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
      .hl-ledger-head, .hl-ledger-row { display: grid; grid-template-columns: 46px 1.4fr 1fr 52px 1.3fr; align-items: center; gap: 8px; padding: 11px 12px; }
      .hl-ledger-head { background: var(--paper); font-size: 10px; text-transform: uppercase; letter-spacing: 0.02em; color: var(--ink-soft); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .hl-ledger-head span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .hl-ledger-row { border-top: 1px solid var(--border); font-size: 13.5px; }
      .hl-ledger-row.me { background: var(--board-tint); }
      .hl-rank { font-family: 'Inter', 'Noto Sans Devanagari', 'Nirmala UI', 'Mangal', sans-serif; font-weight: 800; color: var(--board-dark); font-size: 15px; }
      .hl-lname { font-weight: 600; }
      .hl-lname em { font-style: normal; color: var(--gold-dark); font-weight: 700; }
      .hl-points { display: flex; flex-direction: column; gap: 4px; }
      .hl-bar { display: block; height: 5px; border-radius: 3px; background: var(--paper-line); overflow: hidden; }
      .hl-bar span { display: block; height: 100%; background: var(--gold); }

      .hl-empty { display: flex; align-items: center; gap: 8px; color: var(--ink-soft); font-size: 13px; padding: 20px; justify-content: center; text-align: center; line-height: 1.4; }

      .hl-saving { position: fixed; bottom: 16px; left: 16px; background: var(--gradient); color: #FFFFFF; font-size: 12px; font-weight: 600; padding: 8px 12px; border-radius: 20px; display: flex; align-items: center; gap: 6px; z-index: 50; }
      .hl-toast { position: fixed; bottom: 16px; right: 16px; background: var(--gradient); color: #FFFFFF; font-size: 13px; font-weight: 600; padding: 10px 16px; border-radius: 10px; display: flex; align-items: center; gap: 8px; z-index: 50; box-shadow: 0 8px 24px rgba(0,0,0,0.14); max-width: 320px; }
      .hl-toast.err { background: var(--coral); }

      /* modal (confirm / prompt) */
      .hl-modal-overlay { position: fixed; inset: 0; background: rgba(26,50,44,0.45); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
      .hl-modal-card { background: var(--card); border-radius: 16px; padding: 20px; width: 100%; max-width: 360px; box-shadow: 0 20px 50px rgba(0,0,0,0.18); }
      .hl-menu-card { background: var(--card); border-radius: 16px; padding: 16px; width: 100%; max-width: 320px; box-shadow: 0 20px 50px rgba(0,0,0,0.18); display: flex; flex-direction: column; gap: 10px; }
      .hl-menu-card .hl-user-chip { padding-bottom: 10px; border-bottom: 1px solid var(--border); margin-bottom: 2px; }
      .hl-profile-body { padding: 16px; overflow: auto; display: block; align-items: initial; justify-content: initial; }
      .hl-modal-msg { font-size: 14.5px; line-height: 1.5; margin: 0 0 14px; color: var(--ink); }
      .hl-modal-input { width: 100%; border: 1px solid var(--border); background: var(--paper); border-radius: 9px; padding: 10px 12px; font-size: 15px; font-family: inherit; margin-bottom: 14px; min-height: 42px; }

      /* sub-nav segmented control */
      .hl-segmented { display: flex; gap: 4px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 4px; margin-bottom: 16px; }
      .hl-segmented button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; border: none; background: transparent; padding: 9px 6px; border-radius: 9px; font-size: 12.5px; font-weight: 700; color: var(--ink-soft); cursor: pointer; }
      .hl-segmented button.active { background: var(--board); color: #FFFFFF; }
      .hl-embedded-section { margin-bottom: 4px; }

      .hl-pill.locked { background: var(--paper-line); color: var(--ink-soft); }
      .hl-hw-done { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
      .hl-reattempt-note { font-size: 12px; color: var(--ink-soft); margin: -6px 0 12px; }

      /* MCQ + photo Q&A */
      .hl-q-block { border-bottom: 1px dashed var(--border); padding-bottom: 10px; margin-bottom: 4px; }
      .hl-q-block:last-child { border-bottom: none; }
      .hl-q-mcq { display: flex; flex-direction: column; gap: 8px; }
      .hl-q-mcq-top { display: grid; grid-template-columns: 26px 1fr 60px 40px; gap: 8px; align-items: center; }
      .hl-q-mcq-top input { border: 1px solid var(--border); background: var(--paper); border-radius: 8px; padding: 10px; font-size: 15px; font-family: inherit; min-height: 42px; }
      .hl-mcq-options { display: flex; flex-direction: column; gap: 6px; padding-left: 34px; }
      .hl-mcq-option { display: flex; align-items: center; gap: 8px; font-size: 13.5px; }
      .hl-mcq-option input[type="text"], .hl-mcq-option input:not([type="radio"]) { flex: 1; border: 1px solid var(--border); background: var(--paper); border-radius: 8px; padding: 8px 10px; font-size: 14px; font-family: inherit; min-height: 38px; }
      .hl-mcq-option input[type="radio"] { width: 18px; height: 18px; flex-shrink: 0; accent-color: var(--gold); }
      .hl-mcq-options.solve { padding-left: 0; gap: 8px; }
      .hl-mcq-options.solve .hl-mcq-option { border: 1px solid var(--border); border-radius: 9px; padding: 10px 12px; background: var(--paper); }
      .hl-q-photo { padding-left: 34px; }
      .hl-q-photo-row { grid-column: 2 / span 3; padding-left: 0; }
      .hl-q-photo-preview { display: inline-flex; align-items: center; gap: 8px; }
      .hl-q-photo-preview img { width: 46px; height: 46px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border); }
      .hl-icon-btn.sm { width: 30px; height: 30px; }
      .hl-q-solve-thumb { border: none; background: none; padding: 0; cursor: pointer; display: block; margin: 2px 0; }
      .hl-q-solve-thumb img { max-width: 220px; max-height: 220px; border-radius: 10px; border: 1px solid var(--border); object-fit: contain; }

      /* vertical arithmetic builder */
      .hl-vbuilder { border-top: 1px dashed var(--border); padding-top: 14px; margin-top: 14px; }
      .hl-vbuilder-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
      .hl-vbuilder-row select, .hl-vbuilder-row input { border: 1px solid var(--border); background: var(--paper); border-radius: 9px; padding: 10px; font-size: 14px; font-family: inherit; min-height: 42px; }
      .hl-vb-num { width: 90px; }
      .hl-vb-pts { width: 70px; }
      .hl-q-vert-mark { display: block; margin-top: 2px; color: var(--gold-dark); }

      /* vertical arithmetic solving layout */
      .hl-vertical-problem { display: inline-flex; flex-direction: column; align-items: flex-end; gap: 2px; font-family: 'JetBrains Mono', monospace; font-size: 22px; font-weight: 700; padding: 10px 4px; }
      .hl-vert-num { min-width: 70px; text-align: right; }
      .hl-vert-op-row { display: flex; align-items: center; gap: 10px; }
      .hl-vert-op { color: var(--gold-dark); }
      .hl-vert-line { width: 100%; border-top: 2px solid var(--ink); margin: 2px 0 6px; }
      .hl-vert-answer { width: 100%; text-align: right; border: 2px solid #9CA3AF; background: var(--paper); border-radius: 8px; padding: 8px 10px; font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; min-height: 42px; }
      .hl-vert-answer:focus { border-color: var(--gold); outline: none; }

      /* notes */
      .hl-upload-btn { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; width: fit-content; }
      .hl-notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; }
      .hl-note-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 8px; display: flex; flex-direction: column; gap: 6px; align-items: center; }
      .hl-note-thumb { width: 100%; aspect-ratio: 1; border: none; background: var(--paper); border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer; color: var(--ink-soft); padding: 0; }
      .hl-note-thumb img { width: 100%; height: 100%; object-fit: cover; }
      .hl-note-name { font-size: 11px; color: var(--ink-soft); text-align: center; word-break: break-word; line-height: 1.3; max-width: 100%; }
      .hl-zoom-card { background: var(--card); border-radius: 14px; width: 100%; max-width: 900px; height: 85vh; display: flex; flex-direction: column; overflow: hidden; }
      .hl-zoom-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--border); }
      .hl-zoom-body { flex: 1; overflow: auto; display: flex; align-items: center; justify-content: center; background: var(--paper); }
      .hl-zoom-body img { max-width: 100%; transition: transform 0.15s ease; }
      .hl-pdf-frame { width: 100%; height: 100%; border: none; }

      /* videos */
      .hl-video-list { display: flex; flex-direction: column; gap: 16px; }
      .hl-video-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
      .hl-video-embed { position: relative; width: 100%; padding-top: 56.25%; background: #000; }
      .hl-video-embed iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
      .hl-video-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 14px; }

      /* ===== MOBILE ===== */
      @media (max-width: 760px) {
        .hl-shell { flex-direction: column; }
        .hl-side { display: none; }
        .hl-topbar { display: flex; align-items: center; justify-content: space-between; background: var(--card); border-bottom: 1px solid var(--border); padding: 10px 14px; position: sticky; top: 0; z-index: 30; }
        .hl-topbar-right { display: flex; align-items: center; gap: 8px; }
        .hl-main { padding: 16px 14px 88px; max-width: 100%; }
        .hl-page-head h2 { font-size: 18px; }

        .hl-bottom-nav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; background: var(--card); border-top: 1px solid var(--border); z-index: 30; padding: 4px 2px calc(4px + env(safe-area-inset-bottom)); box-shadow: 0 -6px 18px rgba(0,0,0,0.06); overflow-x: auto; }
        .hl-bottom-nav button { flex: 1 1 0; min-width: 58px; display: flex; flex-direction: column; align-items: center; gap: 2px; border: none; background: transparent; padding: 7px 2px; border-radius: 10px; color: var(--ink-soft); font-size: 10px; font-weight: 700; cursor: pointer; }
        .hl-bottom-nav button.active { color: var(--board-dark); background: var(--board-tint); }
        .hl-bottom-nav button span { line-height: 1.15; text-align: center; }

        .hl-grid-2, .hl-grid-3, .hl-grid-4 { grid-template-columns: 1fr; }
        .hl-q-row { grid-template-columns: 24px 1fr; row-gap: 6px; }
        .hl-q-answer, .hl-q-points { grid-column: 2; }
        .hl-q-points { max-width: 90px; }
        .hl-icon-btn.danger { grid-column: 2; justify-self: start; }

        .hl-ledger-head, .hl-ledger-row { grid-template-columns: 36px 1fr 54px; }
        .hl-ledger-head span:nth-child(3), .hl-ledger-row span:nth-child(3) { display: none; }

        .hl-login-card { padding: 20px 18px; border-radius: 14px; }
        .hl-brand-title { font-size: 17px; }
      }
      @media (max-width: 400px) {
        .hl-bottom-nav button { font-size: 9px; }
        .hl-hw-item { flex-wrap: wrap; }
      }
    `}</style>
  );
}
