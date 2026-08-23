import { useEffect, useState } from "react";
import "./PlayerForm.css";


function PlayerForm({ player, onSave, onCancel }) {
  const [form, setForm] = useState({
    photo: "",
    fullName: "",
    nickname: "",
    birthDate: "",
    whatsappNumber: "",
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
  });

  const [competition, setCompetition] =
    useState("");

  const [relative, setRelative] =
    useState({
      name: "",
      relation: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");




useEffect(() => {
  if (!player) return;

  setForm({
    photo: player.photo || "",
    fullName: player.fullName || "",
    nickname: player.nickname || "",
    birthDate: player.birthDate
      ? player.birthDate.split("T")[0]
      : "",
    whatsappNumber:
      player.whatsappNumber || "",
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
  });
}, [player]);
  // ==========================================
  // HANDLE INPUT
  // ==========================================

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

  // ==========================================
  // PHOTO
  // ==========================================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ==========================================
  // COMPETITION ADD
  // ==========================================

  const addCompetition = () => {
    const value = competition.trim();

    if (!value) return;

    setForm((prev) => ({
      ...prev,
      memorableCompetitions: [
        ...prev.memorableCompetitions,
        value,
      ],
    }));

    setCompetition("");
  };

  // ==========================================
  // COMPETITION DELETE
  // ==========================================

  const removeCompetition = (index) => {
    setForm((prev) => ({
      ...prev,

      memorableCompetitions:
        prev.memorableCompetitions.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // ==========================================
  // RELATIVE INPUT
  // ==========================================

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

  // ==========================================
  // ADD RELATIVE
  // ==========================================

  const addRelative = () => {
    if (
      !relative.name.trim() ||
      !relative.relation.trim()
    ) {
      alert(
        "नातेवाईकाचे नाव आणि नाते भरा."
      );

      return;
    }

    setForm((prev) => ({
      ...prev,

      relativesInPracticeClub: [
        ...prev.relativesInPracticeClub,
        {
          name: relative.name.trim(),
          relation:
            relative.relation.trim(),
        },
      ],
    }));

    setRelative({
      name: "",
      relation: "",
    });
  };

  // ==========================================
  // DELETE RELATIVE
  // ==========================================

  const removeRelative = (index) => {
    setForm((prev) => ({
      ...prev,

      relativesInPracticeClub:
        prev.relativesInPracticeClub.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");

  console.log("1. Submit started");
  console.log("Form data:", form);
  console.log("Edit player:", player);

  // ==========================================
  // BASIC VALIDATION
  // ==========================================

  if (!form.fullName.trim()) {
    setMessage("कृपया पूर्ण नाव भरा.");
    return;
  }

  if (!form.whatsappNumber.trim()) {
    setMessage("कृपया WhatsApp Number भरा.");
    return;
  }

  try {
    setLoading(true);

    // ==========================================
    // GET JWT TOKEN
    // ==========================================

    const token = localStorage.getItem("token");

    console.log("2. Token:", token);

    if (!token) {
      setMessage(
        "Login session सापडले नाही. कृपया पुन्हा Login करा."
      );
      return;
    }

    // ==========================================
    // CREATE OR UPDATE
    // ==========================================

    const url = player
      ? `http://localhost:5000/api/players/${player._id}`
      : "http://localhost:5000/api/players";

    const method = player ? "PUT" : "POST";

    console.log("3. Request URL:", url);
    console.log("4. Request method:", method);
    console.log("5. Sending request to backend...");

    const response = await fetch(url, {
      method: method,

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(form),
    });

    console.log(
      "6. Response status:",
      response.status
    );

    const data = await response.json();

    console.log(
      "7. Backend response:",
      data
    );

    // ==========================================
    // ERROR
    // ==========================================

    if (!response.ok) {
      throw new Error(
        data.message ||
          (
            player
              ? "Player माहिती update करताना error आला."
              : "Player माहिती save करताना error आला."
          )
      );
    }

    // ==========================================
    // SUCCESS
    // ==========================================

    console.log(
      player
        ? "8. Player updated successfully"
        : "8. Player saved successfully"
    );

    setMessage(
      player
        ? "✓ Player माहिती यशस्वीपणे update झाली."
        : "✓ Player माहिती यशस्वीपणे save झाली."
    );

    // ==========================================
    // SEND UPDATED PLAYER TO PARENT
    // ==========================================

    if (onSave) {
      onSave(data.player);
    }

    // ==========================================
    // RESET ONLY AFTER CREATE
    // ==========================================

    if (!player) {
      setForm({
        photo: "",
        fullName: "",
        nickname: "",
        birthDate: "",
        whatsappNumber: "",
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
      });

      // Reset competition
      setCompetition("");

      // Reset relative
      setRelative({
        name: "",
        relation: "",
      });
    }

  } catch (error) {
    console.error(
      "9. Player submit error:",
      error
    );

    setMessage(
      error.message ||
        (
          player
            ? "Player माहिती update करताना error आला."
            : "Player माहिती save करताना error आला."
        )
    );

  } finally {
    setLoading(false);
  }
};
  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <h2>
            Player माहिती भरा
          </h2>

          <p>
            Practice Football Club
            खेळाडूची माहिती नोंदवा
          </p>
        </div>

      </div>

      <form
        className="player-form"
        onSubmit={handleSubmit}
      >

        {/* ================================= */}
        {/* PHOTO */}
        {/* ================================= */}

        <div className="form-section">

          <div className="section-header">

            <div>
              <h2>
                छायाचित्र
              </h2>

              <p>
                खेळाडूचे छायाचित्र निवडा
              </p>
            </div>

          </div>

          <div className="photo-upload">

            {form.photo ? (
              <img
                src={form.photo}
                alt="Player"
                className="player-preview"
              />
            ) : (
              <div className="photo-placeholder">
                ⚽
              </div>
            )}

            <div>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handlePhotoChange
                }
              />

              <p className="form-help">
                JPG, PNG किंवा WEBP
              </p>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* PERSONAL INFORMATION */}
        {/* ================================= */}

        <div className="form-section">

          <div className="section-header">

            <div>
              <h2>
                वैयक्तिक माहिती
              </h2>

              <p>
                खेळाडूची मूलभूत माहिती
              </p>
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>
                पूर्ण नाव *
              </label>

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={
                  handleChange
                }
                placeholder="पूर्ण नाव"
                required
              />

            </div>

            <div className="form-group">

              <label>
                टोपण नाव
              </label>

              <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={
                  handleChange
                }
                placeholder="टोपण नाव"
              />

            </div>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>
                जन्मतारीख
              </label>

              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={
                  handleChange
                }
              />

            </div>

            <div className="form-group">

              <label>
                WhatsApp Number *
              </label>

              <input
                type="tel"
                name="whatsappNumber"
                value={
                  form.whatsappNumber
                }
                onChange={
                  handleChange
                }
                placeholder="10 अंकी क्रमांक"
                maxLength="10"
                required
              />

            </div>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>
                Alternate Contact Number
              </label>

              <input
                type="tel"
                name="alternateContactNumber"
                value={
                  form.alternateContactNumber
                }
                onChange={
                  handleChange
                }
                placeholder="पर्यायी संपर्क क्रमांक"
                maxLength="10"
              />

            </div>

            <div className="form-group">

              <label>
                आहार प्रकार
              </label>

              <select
                name="foodPreference"
                value={
                  form.foodPreference
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  निवडा
                </option>

                <option value="Veg">
                  शाकाहारी (Veg)
                </option>

                <option value="Non-Veg">
                  मांसाहारी (Non-Veg)
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* FOOTBALL INFORMATION */}
        {/* ================================= */}

        <div className="form-section">

          <div className="section-header">

            <div>

              <h2>
                Football माहिती
              </h2>

              <p>
                खेळाडूच्या Football
                प्रवासाची माहिती
              </p>

            </div>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>
                Football सुरू केलेले वर्ष
              </label>

              <input
                type="number"
                name="footballStartedYear"
                value={
                  form.footballStartedYear
                }
                onChange={
                  handleChange
                }
                placeholder="उदा. 2010"
                min="1900"
                max="2100"
              />

            </div>

            <div className="form-group">

              <label>
                खेळातील प्रमुख स्थान
              </label>

              <select
                name="playingPosition"
                value={
                  form.playingPosition
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  निवडा
                </option>

                <option value="Goalkeeper">
                  गोलरक्षक (Goalkeeper)
                </option>

                <option value="Defender">
                  संरक्षक (Defender)
                </option>

                <option value="Midfielder">
                  मध्यरक्षक (Midfielder)
                </option>

                <option value="Forward">
                  आक्रमक (Forward)
                </option>

                <option value="All-Rounder">
                  अष्टपैलू खेळाडू (All-Rounder)
                </option>

              </select>

            </div>

          </div>

          <div className="form-row">

            <div className="form-group">

              <label>
                Practice Club मध्ये
                प्रवेश केलेले वर्ष
              </label>

              <input
                type="number"
                name="practiceClubFromYear"
                value={
                  form.practiceClubFromYear
                }
                onChange={
                  handleChange
                }
                placeholder="उदा. 2014"
                min="1900"
                max="2100"
              />

            </div>

            <div className="form-group">

              <label>
                Practice Club मधील
                खेळाचा शेवटचा वर्ष
              </label>

              <input
                type="number"
                name="practiceClubToYear"
                value={
                  form.practiceClubToYear
                }
                onChange={
                  handleChange
                }
                placeholder="उदा. 2022"
                min="1900"
                max="2100"
                disabled={
                  form.currentlyPlayingAtPracticeClub
                }
              />

            </div>

          </div>

          <div className="checkbox-group">

            <input
              type="checkbox"
              id="currentlyPlaying"
              name="currentlyPlayingAtPracticeClub"
              checked={
                form.currentlyPlayingAtPracticeClub
              }
              onChange={
                handleChange
              }
            />

            <label htmlFor="currentlyPlaying">
              सध्या Practice Club मध्ये
              खेळत आहे
            </label>

          </div>

        </div>

        {/* ================================= */}
        {/* COMPETITIONS */}
        {/* ================================= */}

        <div className="form-section">

          <div className="section-header">

            <div>

              <h2>
                आठवणीतील उल्लेखनीय
                स्पर्धा
              </h2>

              <p>
                आवश्यक तितक्या स्पर्धा
                add करू शकता
              </p>

            </div>

          </div>

          <div className="add-item-row">

            <input
              type="text"
              value={competition}
              onChange={(e) =>
                setCompetition(
                  e.target.value
                )
              }
              placeholder="स्पर्धेचे नाव"
            />

            <button
              type="button"
              className="secondary-btn"
              onClick={
                addCompetition
              }
            >
              + स्पर्धा जोडा
            </button>

          </div>

          {form.memorableCompetitions
            .length > 0 && (

            <div className="items-list">

              {form.memorableCompetitions.map(
                (item, index) => (

                  <div
                    className="item-row"
                    key={index}
                  >

                    <span>
                      {item}
                    </span>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() =>
                        removeCompetition(
                          index
                        )
                      }
                    >
                      ×
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* ================================= */}
        {/* RELATIVES */}
        {/* ================================= */}

        <div className="form-section">

          <div className="section-header">

            <div>

              <h2>
                Practice Club मधील
                नातेवाईक
              </h2>

              <p>
                सध्या Practice Club मध्ये
                खेळणारे नातेवाईक
              </p>

            </div>

          </div>

          <div className="form-group">

            <label>
              आपले कोणते नातेवाईक
              सध्या Practice Club मध्ये
              खेळत आहेत का?
            </label>

            <select
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
            >

              <option value="no">
                नाही
              </option>

              <option value="yes">
                होय
              </option>

            </select>

          </div>

          {form.hasRelativesInPracticeClub && (

            <>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    नातेवाईकाचे नाव
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      relative.name
                    }
                    onChange={
                      handleRelativeChange
                    }
                    placeholder="नाव"
                  />

                </div>

                <div className="form-group">

                  <label>
                    नाते
                  </label>

                  <input
                    type="text"
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

              </div>

              <button
                type="button"
                className="secondary-btn"
                onClick={
                  addRelative
                }
              >
                + नातेवाईक जोडा
              </button>

              {form.relativesInPracticeClub
                .length > 0 && (

                <div className="items-list">

                  {form.relativesInPracticeClub.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        className="item-row"
                        key={index}
                      >

                        <span>
                          <strong>
                            {item.name}
                          </strong>

                          {" - "}

                          {item.relation}
                        </span>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            removeRelative(
                              index
                            )
                          }
                        >
                          ×
                        </button>

                      </div>

                    )
                  )}

                </div>

              )}

            </>

          )}

        </div>

        {/* ================================= */}
        {/* MESSAGE */}
        {/* ================================= */}

        {message && (

          <div
            className={
              message.startsWith("✓")
                ? "success-message"
                : "error-message"
            }
          >
            {message}
          </div>

        )}

        {/* ================================= */}
        {/* SUBMIT */}
        {/* ================================= */}

        <div className="form-actions">

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "माहिती Save होत आहे..."
              : "Player माहिती Save करा"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default PlayerForm;