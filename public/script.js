/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/

let userId =
  localStorage.getItem(
    "certificate_user_id"
  );

if (!userId) {

  userId =
    "user-" +
    crypto.randomUUID();

  localStorage.setItem(
    "certificate_user_id",
    userId
  );

}


/*
|--------------------------------------------------------------------------
| DOM
|--------------------------------------------------------------------------
*/

const courseTitle =
  document.getElementById(
    "courseTitle"
  );

const courseDuration =
  document.getElementById(
    "courseDuration"
  );

const courseInstructor =
  document.getElementById(
    "courseInstructor"
  );

const courseDescription =
  document.getElementById(
    "courseDescription"
  );

const nameInput =
  document.getElementById(
    "nameInput"
  );

const profileForm =
  document.getElementById(
    "profileForm"
  );

const completeButton =
  document.getElementById(
    "completeButton"
  );

const completionBadge =
  document.getElementById(
    "completionBadge"
  );

const progressText =
  document.getElementById(
    "progressText"
  );

const progressBar =
  document.getElementById(
    "progressBar"
  );

const completedMessage =
  document.getElementById(
    "completedMessage"
  );

const certificateLocked =
  document.getElementById(
    "certificateLocked"
  );

const certificateReady =
  document.getElementById(
    "certificateReady"
  );

const previewName =
  document.getElementById(
    "previewName"
  );

const previewCourse =
  document.getElementById(
    "previewCourse"
  );

const certificateId =
  document.getElementById(
    "certificateId"
  );

const downloadButton =
  document.getElementById(
    "downloadButton"
  );

const verifyForm =
  document.getElementById(
    "verifyForm"
  );

const verifyInput =
  document.getElementById(
    "verifyInput"
  );

const verificationResult =
  document.getElementById(
    "verificationResult"
  );


/*
|--------------------------------------------------------------------------
| Application State
|--------------------------------------------------------------------------
*/

let course = null;

let userProgress = null;


/*
|--------------------------------------------------------------------------
| Initialize
|--------------------------------------------------------------------------
*/

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    await loadCourse();

    await loadProgress();

  }
);


/*
|--------------------------------------------------------------------------
| Load Course
|--------------------------------------------------------------------------
*/

async function loadCourse() {

  try {

    const response =
      await fetch(
        "/api/course"
      );

    if (!response.ok) {
      throw new Error(
        "Unable to load course"
      );
    }

    course =
      await response.json();


    courseTitle.textContent =
      course.title;

    courseDuration.textContent =
      course.duration;

    courseInstructor.textContent =
      course.instructor;

    courseDescription.textContent =
      course.description;


  } catch (error) {

    console.error(error);

    showToast(
      "Failed to load course",
      true
    );

  }

}


/*
|--------------------------------------------------------------------------
| Load Progress
|--------------------------------------------------------------------------
*/

async function loadProgress() {

  try {

    const response =
      await fetch(
        `/api/users/${userId}/progress`
      );

    if (!response.ok) {
      throw new Error(
        "Unable to load progress"
      );
    }

    userProgress =
      await response.json();


    if (userProgress.name) {

      nameInput.value =
        userProgress.name;

    }


    updateCompletionUI();


  } catch (error) {

    console.error(error);

    showToast(
      "Failed to load your progress",
      true
    );

  }

}


/*
|--------------------------------------------------------------------------
| Save Name
|--------------------------------------------------------------------------
*/

profileForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const name =
      nameInput.value.trim();


    if (!name) {

      showToast(
        "Please enter your name",
        true
      );

      return;

    }


    try {

      const response =
        await fetch(
          `/api/users/${userId}/profile`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              name
            })
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed to save name"
        );

      }


      userProgress =
        {
          ...userProgress,
          name: data.user.name
        };


      showToast(
        "Name saved successfully"
      );


    } catch (error) {

      showToast(
        error.message,
        true
      );

    }

  }
);


/*
|--------------------------------------------------------------------------
| Complete Course
|--------------------------------------------------------------------------
*/

completeButton.addEventListener(
  "click",
  async () => {

    if (
      !userProgress ||
      !userProgress.name
    ) {

      showToast(
        "Save your name before completing the course.",
        true
      );

      nameInput.focus();

      return;

    }


    completeButton.disabled =
      true;

    completeButton.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>
      Completing...
    `;


    try {

      const response =
        await fetch(
          `/api/users/${userId}/complete`,
          {
            method: "POST"
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Unable to complete course"
        );

      }


      userProgress = {
        ...userProgress,
        completed:
          data.completed,
        certificateId:
          data.certificateId,
        completedAt:
          data.completedAt
      };


      updateCompletionUI();

      showToast(
        "Course completed! Certificate generated."
      );


    } catch (error) {

      showToast(
        error.message,
        true
      );

    } finally {

      completeButton.disabled =
        false;

      completeButton.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        Complete Course
      `;

    }

  }
);


/*
|--------------------------------------------------------------------------
| Completion UI
|--------------------------------------------------------------------------
*/

function updateCompletionUI() {

  if (
    !userProgress ||
    !userProgress.completed
  ) {

    progressText.textContent =
      "0%";

    progressBar.style.width =
      "0%";

    completionBadge.textContent =
      "In Progress";

    completionBadge.className =
      "badge pending";

    completeButton.classList.remove(
      "hidden"
    );

    completedMessage.classList.add(
      "hidden"
    );

    certificateLocked.classList.remove(
      "hidden"
    );

    certificateReady.classList.add(
      "hidden"
    );

    return;

  }


  /*
   * Completed
   */

  progressText.textContent =
    "100%";

  progressBar.style.width =
    "100%";

  completionBadge.textContent =
    "Completed";

  completionBadge.className =
    "badge completed";


  completeButton.classList.add(
    "hidden"
  );

  completedMessage.classList.remove(
    "hidden"
  );


  /*
   * Certificate
   */

  certificateLocked.classList.add(
    "hidden"
  );

  certificateReady.classList.remove(
    "hidden"
  );


  previewName.textContent =
    userProgress.name;

  previewCourse.textContent =
    course
      ? course.title
      : "-";

  certificateId.textContent =
    userProgress.certificateId;

}


/*
|--------------------------------------------------------------------------
| Download Certificate
|--------------------------------------------------------------------------
*/

downloadButton.addEventListener(
  "click",
  () => {

    if (
      !userProgress ||
      !userProgress.completed ||
      !userProgress.certificateId
    ) {

      showToast(
        "Complete the course first.",
        true
      );

      return;

    }


    const url =
      `/api/certificates/${encodeURIComponent(
        userProgress.certificateId
      )}/download`;


    window.location.href =
      url;

  }
);


/*
|--------------------------------------------------------------------------
| Verify Certificate
|--------------------------------------------------------------------------
*/

verifyForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const id =
      verifyInput.value.trim();


    if (!id) {
      return;
    }


    verificationResult.className =
      "verification-result";

    verificationResult.classList.remove(
      "hidden"
    );

    verificationResult.innerHTML = `
      <p>
        <i class="fa-solid fa-spinner fa-spin"></i>
        Checking certificate...
      </p>
    `;


    try {

      const response =
        await fetch(
          `/api/certificates/${encodeURIComponent(id)}`
        );


      const data =
        await response.json();


      if (
        response.ok &&
        data.valid
      ) {

        const certificate =
          data.certificate;


        const date =
          new Date(
            certificate.issuedAt
          ).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "long",
              year: "numeric"
            }
          );


        verificationResult.className =
          "verification-result valid";


        verificationResult.innerHTML = `

          <h4>
            <i class="fa-solid fa-circle-check"></i>
            Certificate Verified
          </h4>

          <p>
            <strong>${escapeHtml(
              certificate.name
            )}</strong>
            successfully completed
            <strong>${escapeHtml(
              certificate.course
            )}</strong>.
            Certificate issued on
            ${date}.
          </p>

        `;


      } else {

        verificationResult.className =
          "verification-result invalid";


        verificationResult.innerHTML = `

          <h4>
            <i class="fa-solid fa-circle-xmark"></i>
            Certificate Not Found
          </h4>

          <p>
            The certificate ID could not be verified.
            Please check the ID and try again.
          </p>

        `;

      }


    } catch (error) {

      verificationResult.className =
        "verification-result invalid";


      verificationResult.innerHTML = `

        <h4>
          Verification failed
        </h4>

        <p>
          Unable to contact the verification server.
          Please try again.
        </p>

      `;

    }

  }
);


/*
|--------------------------------------------------------------------------
| Toast
|--------------------------------------------------------------------------
*/

function showToast(
  message,
  error = false
) {

  const toast =
    document.getElementById(
      "toast"
    );

  const icon =
    document.getElementById(
      "toastIcon"
    );

  const messageElement =
    document.getElementById(
      "toastMessage"
    );


  messageElement.textContent =
    message;


  icon.className =
    error
      ? "fa-solid fa-circle-exclamation"
      : "fa-solid fa-circle-check";


  toast.classList.toggle(
    "error",
    error
  );

  toast.classList.add(
    "show"
  );


  clearTimeout(
    window.toastTimeout
  );


  window.toastTimeout =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      3000
    );

}


/*
|--------------------------------------------------------------------------
| Escape HTML
|--------------------------------------------------------------------------
*/

function escapeHtml(value) {

  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    value ?? "";

  return div.innerHTML;

}