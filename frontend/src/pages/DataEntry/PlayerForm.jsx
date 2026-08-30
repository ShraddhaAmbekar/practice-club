import { useEffect, useState } from "react";
import API_URL from "./../../api";

function PlayerForm({ player, onSave, onCancel }) {
  const getInitialForm = () => ({
    photo: "",
    fullName: "",
    nickname: "",
    birthDate: "",
    contactNumber: "",
    alternateContactNumber: "",
    foodPreference: "",
    footballStartedYear: "",
    practiceClubFromYear: "",
    practiceClubToYear: "",
    currentlyPlayingAtPracticeClub: false,
    playingPosition: "",
    memorableCompetitions: [],
    hasRelativesInPracticeClub: false,
    relativesInPracticeClub: [],
    familyMembersComing: "",
    familyVegMembers: "",
    familyNonVegMembers: "",
  });

  const [form, setForm] = useState(getInitialForm);
  const [competition, setCompetition] = useState("");

  const [relative, setRelative] = useState({
    name: "",
    relation: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================================================
  // LOAD PLAYER FOR ADMIN EDIT
  // =========================================================

  useEffect(() => {
    if (!player) {
      setForm(getInitialForm());

      setCompetition("");

      setRelative({
        name: "",
        relation: "",
      });

      setMessage("");

      return;
    }

    setForm({
      photo: player.photo || "",

      fullName: player.fullName || "",

      nickname: player.nickname || "",

      birthDate: player.birthDate
        ? player.birthDate.split("T")[0]
        : "",

      contactNumber:
        player.contactNumber || "",

      alternateContactNumber:
        player.alternateContactNumber || "",

      foodPreference:
        player.foodPreference || "",

      footballStartedYear:
        player.footballStartedYear || "",

      practiceClubFromYear:
        player.practiceClubFromYear || "",

      practiceClubToYear:
        player.practiceClubToYear || "",

      currentlyPlayingAtPracticeClub:
        Boolean(
          player.currentlyPlayingAtPracticeClub
        ),

      playingPosition:
        player.playingPosition || "",

      memorableCompetitions:
        Array.isArray(
          player.memorableCompetitions
        )
          ? player.memorableCompetitions
          : [],

      hasRelativesInPracticeClub:
        Boolean(
          player.hasRelativesInPracticeClub
        ),

      relativesInPracticeClub:
        Array.isArray(
          player.relativesInPracticeClub
        )
          ? player.relativesInPracticeClub
          : [],

      familyMembersComing:
        player.familyMembersComing || "",

      familyVegMembers:
        player.familyVegMembers || "",

      familyNonVegMembers:
        player.familyNonVegMembers || "",
    });

    setCompetition("");

    setRelative({
      name: "",
      relation: "",
    });

    setMessage("");
  }, [player]);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================================================
  // PHOTO
  // =========================================================

  const handlePhotoChange = (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    setMessage("Photo size 5 MB पेक्षा कमी असावी.");
    e.target.value = "";
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    setMessage("फक्त JPG, PNG किंवा WEBP image वापरा.");
    e.target.value = "";
    return;
  }

  setMessage("");
  setLoading(true);

  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();

    img.onload = () => {
      const MAX_SIZE = 800;

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_SIZE) {
          height = Math.round(
            (height * MAX_SIZE) / width
          );
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width = Math.round(
            (width * MAX_SIZE) / height
          );
          height = MAX_SIZE;
        }
      }

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      const compressedPhoto =
        canvas.toDataURL(
          "image/jpeg",
          0.7
        );

      setForm((prev) => ({
        ...prev,
        photo: compressedPhoto,
      }));

      setMessage("");
      setLoading(false);
    };

    img.onerror = () => {
      setMessage("Photo process करताना error आला.");
      setLoading(false);
    };

    img.src = event.target.result;
  };

  reader.onerror = () => {
    setMessage("Photo read करताना error आला.");
    setLoading(false);
  };

  reader.readAsDataURL(file);
};

  const removePhoto = () => {
    setForm((prev) => ({
      ...prev,
      photo: "",
    }));

    setMessage("");
  };

  // =========================================================
  // COMPETITION ADD
  // =========================================================

  const addCompetition = () => {
    const value = competition.trim();

    if (!value) {
      return;
    }

    if (
      form.memorableCompetitions.includes(
        value
      )
    ) {
      setMessage(
        "ही competition आधीच add केली आहे."
      );

      return;
    }

    setForm((prev) => ({
      ...prev,

      memorableCompetitions: [
        ...prev.memorableCompetitions,
        value,
      ],
    }));

    setCompetition("");

    setMessage("");
  };

  // =========================================================
  // COMPETITION DELETE
  // =========================================================

  const removeCompetition = (index) => {
    setForm((prev) => ({
      ...prev,

      memorableCompetitions:
        prev.memorableCompetitions.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // =========================================================
  // RELATIVE INPUT
  // =========================================================

  const handleRelativeChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setRelative((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // ADD RELATIVE
  // =========================================================

  const addRelative = () => {
    if (
      !relative.name.trim() ||
      !relative.relation.trim()
    ) {
      setMessage(
        "नातेवाईकाचे नाव आणि नाते भरा."
      );

      return;
    }

    const newRelative = {
      name: relative.name.trim(),
      relation: relative.relation.trim(),
    };

    setForm((prev) => ({
      ...prev,

      relativesInPracticeClub: [
        ...prev.relativesInPracticeClub,
        newRelative,
      ],
    }));

    setRelative({
      name: "",
      relation: "",
    });

    setMessage("");
  };

  // =========================================================
  // DELETE RELATIVE
  // =========================================================

  const removeRelative = (index) => {
    setForm((prev) => ({
      ...prev,

      relativesInPracticeClub:
        prev.relativesInPracticeClub.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // =========================================================
  // VALIDATE PHONE
  // =========================================================

  const isValidPhone = (number) => {
    return /^[6-9]\d{9}$/.test(
      number.trim()
    );
  };
const API_URL = import.meta.env.VITE_API_URL;
  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (!form.fullName.trim()) {
      setMessage(
        "कृपया पूर्ण नाव भरा."
      );

      return;
    }

    if (!form.contactNumber.trim()) {
      setMessage(
        "कृपया contact Number भरा."
      );

      return;
    }

    if (
      !isValidPhone(
        form.contactNumber
      )
    ) {
      setMessage(
        "कृपया योग्य 10 अंकी contact Number भरा."
      );

      return;
    }

    if (
      form.alternateContactNumber &&
      !isValidPhone(
        form.alternateContactNumber
      )
    ) {
      setMessage(
        "कृपया योग्य Alternate Contact Number भरा."
      );

      return;
    }

    if (
      form.practiceClubFromYear &&
      form.practiceClubToYear &&
      !form.currentlyPlayingAtPracticeClub &&
      Number(form.practiceClubToYear) <
        Number(form.practiceClubFromYear)
    ) {
      setMessage(
        "Practice Club चे शेवटचे वर्ष हे प्रवेश वर्षापेक्षा कमी असू शकत नाही."
      );

      return;
    }

    // -------------------------------------------------------
    // FAMILY MEMBERS VALIDATION
    // -------------------------------------------------------

    const totalFamilyMembers =
      Number(
        form.familyMembersComing || 0
      );

    const totalVegMembers =
      Number(
        form.familyVegMembers || 0
      );

    const totalNonVegMembers =
      Number(
        form.familyNonVegMembers || 0
      );

    const calculatedFamilyMembers =
      totalVegMembers +
      totalNonVegMembers;

    // If Family Members selected,
    // Veg + Non-Veg must be exactly equal
    if (
      form.familyMembersComing &&
      calculatedFamilyMembers !==
        totalFamilyMembers
    ) {
      setMessage(
        `Family Members चे Total चुकीचे आहे. कृपया योग्य संख्या निवडा.`
      );

      return;
    }

    try {
      setLoading(true);

      // -------------------------------------------------------
      // GET TOKEN
      // -------------------------------------------------------

      const token =
        localStorage.getItem("token");

      if (!token) {
        setMessage(
          "Login session सापडले नाही. कृपया पुन्हा Login करा."
        );

        return;
      }

      // -------------------------------------------------------
      // CREATE / UPDATE
      // -------------------------------------------------------

      const isEdit = Boolean(
        player?._id
      );

      const url = isEdit
  ? `${API_URL}/api/players/${player._id}`
  : `${API_URL}/api/players`;

      const method = isEdit
        ? "PUT"
        : "POST";

      console.log(
        "Player request:",
        {
          url,
          method,
          isEdit,
          form,
        }
      );

      // -------------------------------------------------------
      // API REQUEST
      // -------------------------------------------------------

      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(form),
        }
      );

      // -------------------------------------------------------
      // RESPONSE
      // -------------------------------------------------------

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log(
        "Backend response:",
        data
      );

      // -------------------------------------------------------
      // ERROR
      // -------------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.message ||
            (
              isEdit
                ? "Player माहिती update करताना error आला."
                : "Player माहिती save करताना error आला."
            )
        );
      }

      // -------------------------------------------------------
      // SUCCESS
      // -------------------------------------------------------

      setMessage(
        isEdit
          ? "✓ Player माहिती यशस्वीपणे update झाली."
          : "✓ Player माहिती यशस्वीपणे save झाली."
      );

      // -------------------------------------------------------
      // SEND DATA TO PARENT
      // -------------------------------------------------------

      if (onSave) {
        onSave(
          data.player || data
        );
      }

      // -------------------------------------------------------
      // RESET AFTER NEW ENTRY
      // -------------------------------------------------------

      if (!isEdit) {
        setForm(
          getInitialForm()
        );

        setCompetition("");

        setRelative({
          name: "",
          relation: "",
        });
      }
    } catch (error) {
      console.error(
        "Player submit error:",
        error
      );

      setMessage(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FFFDF7] text-[#111111] px-3 py-4 sm:px-6 sm:py-6 lg:px-10">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute -top-60 -right-60 h-[600px] w-[600px] rounded-full bg-[#F5E7B2]/40 blur-3xl" />

        <div className="absolute -bottom-60 -left-60 h-[600px] w-[600px] rounded-full bg-[#D4A017]/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#8A5A0A 1px, transparent 1px), linear-gradient(90deg, #8A5A0A 1px, transparent 1px)",

            backgroundSize:
              "70px 70px",
          }}
        />

      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl min-w-0">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-5 sm:mb-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">

              <div className="mb-2 flex items-center gap-3">

                <div className="h-8 w-1 shrink-0 rounded-full bg-[#D4A017]" />

                <span className="break-words text-[9px] font-black uppercase tracking-[0.2em] text-[#8A5A0A] sm:text-[10px] sm:tracking-[0.28em]">
                  Practice Football Club
                </span>

              </div>

              <h1 className="break-words text-2xl font-black tracking-tight text-[#111111] sm:text-3xl md:text-4xl">

                {player
                  ? "Edit Player"
                  : "Invitees Registration"}

              </h1>

              <p className="mt-2 break-words text-xs text-[#6F6250] sm:text-sm">

                {player
                  ? "माजी खेळाडूची माहिती update करा."
                  : "माजी खेळाडूची माहिती व्यवस्थित नोंदवा."}

              </p>

            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-full border border-[#E8D49A] bg-white px-4 py-2 shadow-sm sm:flex">

              <span className="h-2 w-2 rounded-full bg-[#D4A017]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A5A0A]">
                {player
                  ? "Admin Edit"
                  : "New Entry"}
              </span>

            </div>

          </div>

        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5"
        >

          {/* ===================================================
              PHOTO
          =================================================== */}

          <FormSection
            number="01"
            title="PHOTO"
            subtitle="खेळाडूचे छायाचित्र"
          >

            <div className="flex min-w-0 flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">

              {/* PHOTO PREVIEW */}

              <div className="relative shrink-0">

                {form.photo ? (

                  <div className="relative">

                    <img
                      src={form.photo}
                      alt={
                        form.fullName ||
                        "Player"
                      }
                      className="h-28 w-28 rounded-2xl object-cover border-4 border-white shadow-lg sm:h-32 sm:w-32"
                    />

                    {/* REMOVE PHOTO */}

                    <button
                      type="button"
                      onClick={removePhoto}
                      disabled={loading}
                      className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-lg font-bold text-white shadow-md transition hover:bg-red-600 disabled:opacity-50"
                      title="Remove photo"
                    >
                      ×
                    </button>

                  </div>

                ) : (

                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-[#111111] shadow-lg sm:h-32 sm:w-32">

                    <span className="text-4xl">
                      ⚽
                    </span>

                  </div>

                )}

              </div>

              {/* PHOTO INPUT */}

              <div className="w-full min-w-0 flex-1">

                <label className="mb-2 block text-xs font-bold text-[#6F6250]">
                  Player Photo
                </label>

                <input
                
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handlePhotoChange
                  }
                  disabled={loading}
                  required
                  className="block w-full min-w-0 overflow-hidden rounded-xl border border-[#E8D49A] bg-[#FFFDF7] px-3 py-3 text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-[#FFF8E5] file:px-3 file:py-2 file:font-bold file:text-[#8A5A0A] hover:border-[#D4A017] disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm sm:file:mr-4 sm:file:px-4"
                />

                <p className="mt-2 text-xs text-[#9A8F7D]">
                  JPG, PNG किंवा WEBP. Maximum 5 MB.
                </p>

                {form.photo && (
                  <p className="mt-2 text-xs font-semibold text-[#8A5A0A]">
                    ✓ Photo selected
                  </p>
                )}

              </div>

            </div>

          </FormSection>

          {/* ===================================================
              PERSONAL INFORMATION
          =================================================== */}

          <FormSection
            number="02"
            title="PERSONAL INFORMATION"
            subtitle="माजी खेळाडूची मूलभूत माहिती"
          >

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">

              <InputField
                label="पूर्ण नाव *"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="पूर्ण नाव"
                required
              />

              <InputField
                label="मैदानावरील टोपण नाव"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                placeholder="मैदानावरील टोपण नाव"
              />

              <InputField
                label="जन्मतारीख"
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                required
              />

              <InputField
                label="contact Number *"
                type="tel"
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                placeholder="10 अंकी क्रमांक"
                maxLength="10"
                inputMode="numeric"
                required
              />

              <InputField
                label="Alternate Contact Number"
                type="tel"
                name="alternateContactNumber"
                value={
                  form.alternateContactNumber
                }
                onChange={handleChange}
                placeholder="पर्यायी संपर्क क्रमांक"
                maxLength="10"
                inputMode="numeric"
              />

              <SelectField
                label="आहार प्रकार"
                name="foodPreference"
                value={
                  form.foodPreference
                }
                onChange={handleChange}
                options={[
                  ["", "निवडा"],

                  [
                    "Veg",
                    "शाकाहारी (Veg)",
                  ],

                  [
                    "Non-Veg",
                    "मांसाहारी (Non-Veg)",
                  ],
                ]}
              />

            </div>

          </FormSection>

          {/* ===================================================
              FOOTBALL INFORMATION
          =================================================== */}

          <FormSection
            number="03"
            title="Football माहिती"
            subtitle="खेळाडूच्या Football प्रवासाची माहिती"
          >

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">

              <YearSelectField
                label="Football सुरू केलेले वर्ष"
                name="footballStartedYear"
                value={
                  form.footballStartedYear
                }
                onChange={handleChange}
              />

              <SelectField
                label="खेळातील प्रमुख स्थान"
                name="playingPosition"
                value={
                  form.playingPosition
                }
                onChange={handleChange}
                options={[
                  ["", "निवडा"],

                  [
                    "Goalkeeper",
                    "गोलरक्षक (Goalkeeper)",
                  ],

                  [
                    "Defender",
                    "संरक्षक (Defender)",
                  ],

                  [
                    "Midfielder",
                    "मध्यरक्षक (Midfielder)",
                  ],

                  [
                    "Forward",
                    "आक्रमक (Forward)",
                  ],

                  [
                    "All-Rounder",
                    "अष्टपैलू खेळाडू (All-Rounder)",
                  ],
                ]}
              />

              <YearSelectField
                label="Practice Club मध्ये प्रवेश केलेले वर्ष"
                name="practiceClubFromYear"
                value={
                  form.practiceClubFromYear
                }
                onChange={handleChange}
              />

              <YearSelectField
                label="Practice Club मधील खेळाचा शेवटचा वर्ष"
                name="practiceClubToYear"
                value={
                  form.practiceClubToYear
                }
                onChange={handleChange}
                disabled={
                  form.currentlyPlayingAtPracticeClub
                }
              />

            </div>

            {/* CURRENT PLAYER */}

            <div className="mt-5 rounded-2xl border border-[#E8D49A] bg-[#FFF8E5] p-3 sm:mt-6 sm:p-4">

              <label className="flex cursor-pointer items-start gap-3">

                <input
                  type="checkbox"
                  id="currentlyPlaying"
                  name="currentlyPlayingAtPracticeClub"
                  checked={
                    form.currentlyPlayingAtPracticeClub
                  }
                  onChange={handleChange}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-[#D4A017] text-[#D4A017] focus:ring-[#D4A017]"
                />

                <div className="min-w-0">

                  <span className="block break-words text-sm font-bold text-[#111111]">
                    सध्या Practice Club मध्ये खेळत आहे
                  </span>

                  <span className="mt-0.5 block break-words text-xs text-[#6F6250]">
                    Player सध्या Club मध्ये active असल्यास निवडा.
                  </span>

                </div>

              </label>

            </div>

          </FormSection>

          {/* ===================================================
              COMPETITIONS
          =================================================== */}

          <FormSection
            number="04"
            title="आठवणीतील उल्लेखनीय स्पर्धा"
            subtitle="आवश्यक तितक्या स्पर्धा add करू शकता"
          >

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row">

              <input
                type="text"
                value={competition}
                onChange={(e) =>
                  setCompetition(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();

                    addCompetition();
                  }
                }}
                placeholder="स्पर्धेचे नाव"
                className="h-12 min-w-0 w-full flex-1 rounded-xl border border-[#E8D49A] bg-[#FFFDF7] px-4 text-sm outline-none transition focus:bg-white focus:border-[#D4A017] focus:ring-4 focus:ring-[#D4A017]/10"
              />

              <button
                type="button"
                onClick={
                  addCompetition
                }
                className="h-12 w-full shrink-0 rounded-xl bg-[#111111] px-6 text-sm font-bold text-white transition hover:bg-[#D4A017] hover:text-[#111111] sm:w-auto"
              >
                + स्पर्धा जोडा
              </button>

            </div>

            {form.memorableCompetitions
              .length > 0 && (

              <div className="mt-4 space-y-2">

                {form.memorableCompetitions.map(
                  (item, index) => (

                    <div
                      key={`${item}-${index}`}
                      className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#E8D49A] bg-[#FFFDF7] px-3 py-3 sm:px-4"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F5E7B2] text-xs font-black text-[#8A5A0A]">
                          {index + 1}
                        </span>

                        <span className="min-w-0 break-words text-sm font-semibold text-[#3F382E]">
                          {item}
                        </span>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeCompetition(
                            index
                          )
                        }
                        className="h-8 w-8 shrink-0 rounded-lg text-[#9A8F7D] transition hover:bg-red-50 hover:text-red-600"
                      >
                        ×
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </FormSection>

          {/* ===================================================
              RELATIVES
          =================================================== */}

          <FormSection
            number="05"
            title="Practice Club मधील नातेवाईक"
            subtitle="सध्या Practice Club मध्ये खेळणारे नातेवाईक"
          >

            <SelectField
              label="आपले कोणते नातेवाईक सध्या Practice Club मध्ये खेळत आहेत का?"
              name="hasRelativesInPracticeClub"
              value={
                form.hasRelativesInPracticeClub
                  ? "yes"
                  : "no"
              }
              onChange={(e) => {

                const hasRelative =
                  e.target.value ===
                  "yes";

                setForm((prev) => ({
                  ...prev,

                  hasRelativesInPracticeClub:
                    hasRelative,

                  relativesInPracticeClub:
                    hasRelative
                      ? prev.relativesInPracticeClub
                      : [],
                }));

              }}
              options={[
                ["no", "नाही"],
                ["yes", "होय"],
              ]}
            />

            {form.hasRelativesInPracticeClub && (

              <div className="mt-5">

                <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">

                  <InputField
                    label="नातेवाईकाचे नाव"
                    name="name"
                    value={
                      relative.name
                    }
                    onChange={
                      handleRelativeChange
                    }
                    placeholder="नाव"
                  />

                  <InputField
                    label="नाते"
                    name="relation"
                    value={
                      relative.relation
                    }
                    onChange={
                      handleRelativeChange
                    }
                    placeholder="उदा. भाऊ"
                  />

                </div>

                <button
                  type="button"
                  onClick={
                    addRelative
                  }
                  className="mt-4 h-12 w-full rounded-xl bg-[#111111] px-6 text-sm font-bold text-white transition hover:bg-[#D4A017] hover:text-[#111111] sm:w-auto"
                >
                  + नातेवाईक जोडा
                </button>

                {form.relativesInPracticeClub
                  .length > 0 && (

                  <div className="mt-4 space-y-2">

                    {form.relativesInPracticeClub.map(
                      (item, index) => (

                        <div
                          key={`${item.name}-${index}`}
                          className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#E8D49A] bg-[#FFFDF7] px-3 py-3 sm:px-4"
                        >

                          <div className="min-w-0">

                            <p className="break-words text-sm font-bold text-[#111111]">
                              {item.name}
                            </p>

                            <p className="mt-0.5 break-words text-xs text-[#9A8F7D]">
                              {item.relation}
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeRelative(
                                index
                              )
                            }
                            className="h-8 w-8 shrink-0 rounded-lg text-[#9A8F7D] transition hover:bg-red-50 hover:text-red-600"
                          >
                            ×
                          </button>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

          </FormSection>

          {/* ===================================================
              FAMILY / EVENT INFORMATION
          =================================================== */}

          <FormSection
            number="06"
            title="कार्यक्रमाची माहिती"
            subtitle="कार्यक्रमाला येणाऱ्या Family Members ची माहिती"
          >

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">

              {/* FAMILY MEMBERS DROPDOWN */}

              <SelectField
                label="किती Family Members येणार आहेत?"
                name="familyMembersComing"
                value={
                  form.familyMembersComing
                }
                onChange={handleChange}
                options={[
                  ["", "निवडा"],
                  ["0", "0 Members"],
                  ["1", "1 Member"],
                  ["2", "2 Members"],
                  ["3", "3 Members"],
                ]}
              />

              {/* VEG MEMBERS */}

              <SelectField
                label="त्यापैकी Veg किती?"
                name="familyVegMembers"
                value={
                  form.familyVegMembers
                }
                onChange={handleChange}
                options={[
                  ["", "निवडा"],
                  ["0", "0"],
                  ["1", "1"],
                  ["2", "2"],
                  ["3", "3"],
                ]}
              />

              {/* NON VEG MEMBERS */}

              <SelectField
                label="त्यापैकी Non-Veg किती?"
                name="familyNonVegMembers"
                value={
                  form.familyNonVegMembers
                }
                onChange={handleChange}
                options={[
                  ["", "निवडा"],
                  ["0", "0"],
                  ["1", "1"],
                  ["2", "2"],
                  ["3", "3"],
                ]}
              />

            </div>

            {/* SUMMARY */}

            <div className="mt-5 rounded-2xl border border-[#E8D49A] bg-[#FFF8E5] p-4">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              

                <div className="flex flex-wrap gap-2">

                  <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">

                    Veg:{" "}

                    {form.familyVegMembers ||
                      0}

                  </span>

                  <span className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">

                    Non-Veg:{" "}

                    {form.familyNonVegMembers ||
                      0}

                  </span>

                  {/* CALCULATED TOTAL */}

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                      Number(
                        form.familyVegMembers ||
                          0
                      ) +
                        Number(
                          form.familyNonVegMembers ||
                            0
                        ) ===
                        Number(
                          form.familyMembersComing ||
                            0
                        )
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >

                    Total:{" "}

                    {Number(
                      form.familyVegMembers ||
                        0
                    ) +
                      Number(
                        form.familyNonVegMembers ||
                          0
                      )}

                  </span>

                </div>

              </div>

            </div>

          </FormSection>

          {/* ===================================================
              MESSAGE
          =================================================== */}

          {message && (

            <div
              className={
                message.startsWith("✓")
                  ? "break-words rounded-2xl border border-[#E8D49A] bg-[#FFF8E5] px-4 py-3 text-xs font-semibold text-[#8A5A0A] sm:px-5 sm:py-4 sm:text-sm"
                  : "break-words rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 sm:px-5 sm:py-4 sm:text-sm"
              }
            >
              {message}
            </div>

          )}

          {/* ===================================================
              ACTIONS
          =================================================== */}

          <div className="sticky bottom-2 z-20 sm:bottom-3">

            <div className="rounded-2xl border border-[#E8D49A] bg-white/95 p-2.5 shadow-[0_15px_50px_rgba(138,90,10,0.10)] backdrop-blur-md sm:p-3">

              <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">

                {onCancel && (

                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-[#E8D49A] bg-white px-6 text-sm font-bold text-[#6F6250] transition hover:bg-[#FFF8E5] disabled:opacity-50 sm:w-auto"
                  >
                    Cancel
                  </button>

                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group h-12 w-full rounded-xl bg-[#111111] px-8 text-sm font-black text-white transition hover:bg-[#D4A017] hover:text-[#111111] hover:shadow-lg hover:shadow-[#D4A017]/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >

                  <span className="flex items-center justify-center gap-3">

                    {loading ? (

                      <>

                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-[#D4A017] animate-spin" />

                        {player
                          ? "Update होत आहे..."
                          : "Save होत आहे..."}

                      </>

                    ) : (

                      <>

                        {player
                          ? "Player Update करा"
                          : "Player माहिती Save करा"}

                        <span className="text-lg transition-transform group-hover:translate-x-1">
                          →
                        </span>

                      </>

                    )}

                  </span>

                </button>

              </div>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
}

// =========================================================
// FORM SECTION
// =========================================================

function FormSection({
  number,
  title,
  subtitle,
  children,
}) {
  return (
    <section className="relative min-w-0 overflow-hidden rounded-2xl border border-[#E8D49A] bg-white shadow-[0_10px_35px_rgba(138,90,10,0.05)] sm:rounded-[22px]">

      <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#D4A017]" />

      <div className="p-4 sm:p-6 lg:p-7">

        <div className="mb-5 flex min-w-0 items-start gap-3 sm:mb-6 sm:gap-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF8E5] text-[10px] font-black text-[#8A5A0A]">
            {number}
          </div>

          <div className="min-w-0">

            <h2 className="break-words text-base font-black tracking-tight text-[#111111] sm:text-xl">
              {title}
            </h2>

            <p className="mt-1 break-words text-xs text-[#9A8F7D] sm:text-sm">
              {subtitle}
            </p>

          </div>

        </div>

        {children}

      </div>

    </section>
  );
}

// =========================================================
// INPUT FIELD
// =========================================================

function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  min,
  max,
  disabled = false,
  inputMode,
}) {
  return (
    <div className="min-w-0">

      <label className="mb-2 block break-words text-xs font-bold text-[#6F6250]">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        min={min}
        max={max}
        disabled={disabled}
        inputMode={inputMode}
        className="h-12 w-full min-w-0 rounded-xl border border-[#E8D49A] bg-[#FFFDF7] px-3 text-sm text-[#111111] outline-none transition-all placeholder:text-[#9A8F7D] focus:border-[#D4A017] focus:bg-white focus:ring-4 focus:ring-[#D4A017]/10 disabled:cursor-not-allowed disabled:bg-[#F3F0E8] disabled:text-[#9A8F7D] sm:px-4"
      />

    </div>
  );
}

// =========================================================
// SELECT FIELD
// =========================================================

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
}) {
  return (
    <div className="min-w-0">

      <label className="mb-2 block break-words text-xs font-bold text-[#6F6250]">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="h-12 w-full min-w-0 rounded-xl border border-[#E8D49A] bg-[#FFFDF7] px-3 text-sm text-[#111111] outline-none transition-all focus:border-[#D4A017] focus:bg-white focus:ring-4 focus:ring-[#D4A017]/10 disabled:cursor-not-allowed disabled:bg-[#F3F0E8] disabled:text-[#9A8F7D] sm:px-4"
      >

        {options.map(
          ([
            optionValue,
            optionLabel,
          ]) => (

            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>

          )
        )}

      </select>

    </div>
  );
}

// =========================================================
// YEAR SELECT FIELD
// =========================================================

function YearSelectField({
  label,
  name,
  value,
  onChange,
  disabled = false,
}) {
  const currentYear =
    new Date().getFullYear();

  const startYear = 1950;

  const years = [];

  for (
    let year = currentYear;
    year >= startYear;
    year--
  ) {
    years.push(year);
  }

  return (
    <div className="min-w-0">

      <label className="mb-2 block break-words text-xs font-bold text-[#6F6250]">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="h-12 w-full min-w-0 rounded-xl border border-[#E8D49A] bg-[#FFFDF7] px-3 text-sm text-[#111111] outline-none transition-all focus:border-[#D4A017] focus:bg-white focus:ring-4 focus:ring-[#D4A017]/10 disabled:cursor-not-allowed disabled:bg-[#F3F0E8] disabled:text-[#9A8F7D] sm:px-4"
      >

        <option value="">
          वर्ष निवडा
        </option>

        {years.map((year) => (

          <option
            key={year}
            value={year}
          >
            {year}
          </option>

        ))}

      </select>

      {disabled && (

        <p className="mt-1 break-words text-[11px] text-[#8A5A0A]">
          सध्या Club मध्ये खेळत असल्यामुळे शेवटचे वर्ष लागू नाही.
        </p>

      )}

    </div>
  );
}

export default PlayerForm;