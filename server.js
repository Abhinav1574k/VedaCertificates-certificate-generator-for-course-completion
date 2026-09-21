const express = require("express");
const path = require("path");
const crypto = require("crypto");

const {
  PDFDocument,
  rgb,
  StandardFonts
} = require("pdf-lib");

const app = express();

const PORT = process.env.PORT || 3000;


/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);


/*
|--------------------------------------------------------------------------
| In-Memory Application Data
|--------------------------------------------------------------------------
|
| This project intentionally uses in-memory storage.
| For a production application, this could be replaced
| with PostgreSQL, MySQL, MongoDB, etc.
|
|--------------------------------------------------------------------------
*/

const users = new Map();

const certificates = new Map();


/*
|--------------------------------------------------------------------------
| Demo Course
|--------------------------------------------------------------------------
*/

const course = {
  id: "web-development-masterclass",

  title: "Full Stack Web Development",

  instructor: "Veda Technology",

  duration: "45 Days",

  description:
    "HTML, CSS, JavaScript, Node.js and Express.js"
};


/*
|--------------------------------------------------------------------------
| Utility Functions
|--------------------------------------------------------------------------
*/

function generateCertificateId() {

  const randomPart =
    crypto
      .randomBytes(5)
      .toString("hex")
      .toUpperCase();

  return `VEDA-${new Date().getFullYear()}-${randomPart}`;
}


function getOrCreateUser(userId) {

  if (!users.has(userId)) {

    users.set(userId, {
      id: userId,
      name: "",
      completed: false,
      certificateId: null,
      completedAt: null
    });

  }

  return users.get(userId);
}


/*
|--------------------------------------------------------------------------
| API — Course Information
|--------------------------------------------------------------------------
*/

app.get("/api/course", (req, res) => {

  res.json(course);

});


/*
|--------------------------------------------------------------------------
| API — Get User Progress
|--------------------------------------------------------------------------
*/

app.get("/api/users/:userId/progress", (req, res) => {

  const user =
    getOrCreateUser(req.params.userId);

  res.json({
    userId: user.id,
    name: user.name,
    completed: user.completed,
    certificateId: user.certificateId,
    completedAt: user.completedAt
  });

});


/*
|--------------------------------------------------------------------------
| API — Save User Name
|--------------------------------------------------------------------------
*/

app.post("/api/users/:userId/profile", (req, res) => {

  const user =
    getOrCreateUser(req.params.userId);

  const name =
    typeof req.body.name === "string"
      ? req.body.name.trim()
      : "";

  if (!name) {

    return res.status(400).json({
      error: "Name is required"
    });

  }

  if (name.length < 2) {

    return res.status(400).json({
      error: "Name must contain at least 2 characters"
    });

  }

  if (name.length > 80) {

    return res.status(400).json({
      error: "Name must not exceed 80 characters"
    });

  }

  user.name = name;

  res.json({
    message: "Profile saved",
    user
  });

});


/*
|--------------------------------------------------------------------------
| API — Complete Course
|--------------------------------------------------------------------------
*/

app.post("/api/users/:userId/complete", (req, res) => {

  const user =
    getOrCreateUser(req.params.userId);

  if (!user.name) {

    return res.status(400).json({
      error:
        "Please enter your name before completing the course."
    });

  }


  /*
   * Do not generate a second certificate.
   */

  if (user.completed && user.certificateId) {

    return res.json({
      message: "Course is already completed.",
      completed: true,
      certificateId: user.certificateId,
      completedAt: user.completedAt
    });

  }


  user.completed = true;

  user.completedAt =
    new Date().toISOString();

  user.certificateId =
    generateCertificateId();


  certificates.set(
    user.certificateId,
    {
      id: user.certificateId,

      userId: user.id,

      name: user.name,

      course: course.title,

      instructor: course.instructor,

      duration: course.duration,

      issuedAt: user.completedAt
    }
  );


  res.json({
    message: "Course completed successfully.",
    completed: true,
    certificateId: user.certificateId,
    completedAt: user.completedAt
  });

});


/*
|--------------------------------------------------------------------------
| API — Certificate Information
|--------------------------------------------------------------------------
*/

app.get(
  "/api/certificates/:certificateId",
  (req, res) => {

    const certificate =
      certificates.get(
        req.params.certificateId
      );

    if (!certificate) {

      return res.status(404).json({
        valid: false,
        error: "Certificate not found"
      });

    }

    res.json({
      valid: true,
      certificate
    });

  }
);


/*
|--------------------------------------------------------------------------
| PDF Certificate
|--------------------------------------------------------------------------
*/

app.get(
  "/api/certificates/:certificateId/download",
  async (req, res) => {

    try {

      const certificate =
        certificates.get(
          req.params.certificateId
        );


      if (!certificate) {

        return res.status(404).json({
          error: "Certificate not found"
        });

      }


      const pdfDoc =
        await PDFDocument.create();


      /*
       * Landscape A4
       */

      const page =
        pdfDoc.addPage([
          841.89,
          595.28
        ]);


      const {
        width,
        height
      } = page.getSize();


      /*
       * Fonts
       */

      const regularFont =
        await pdfDoc.embedFont(
          StandardFonts.Helvetica
        );

      const boldFont =
        await pdfDoc.embedFont(
          StandardFonts.HelveticaBold
        );

      const italicFont =
        await pdfDoc.embedFont(
          StandardFonts.HelveticaOblique
        );


      /*
       * Colors
       */

      const dark =
        rgb(
          0.08,
          0.06,
          0.18
        );

      const purple =
        rgb(
          0.42,
          0.18,
          0.82
        );

      const gold =
        rgb(
          0.82,
          0.60,
          0.18
        );

      const lightPurple =
        rgb(
          0.95,
          0.92,
          1
        );

      const muted =
        rgb(
          0.40,
          0.37,
          0.48
        );


      /*
       * Background
       */

      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(
          0.98,
          0.98,
          1
        )
      });


      /*
       * Outer border
       */

      page.drawRectangle({
        x: 25,
        y: 25,
        width: width - 50,
        height: height - 50,
        borderColor: purple,
        borderWidth: 3
      });


      /*
       * Inner border
       */

      page.drawRectangle({
        x: 35,
        y: 35,
        width: width - 70,
        height: height - 70,
        borderColor: gold,
        borderWidth: 1
      });


      /*
       * Top accent
       */

      page.drawRectangle({
        x: 35,
        y: height - 70,
        width: width - 70,
        height: 5,
        color: purple
      });


      /*
       * Organization
       */

      const organization =
        "VEDA TECHNOLOGY";

      const orgWidth =
        boldFont.widthOfTextAtSize(
          organization,
          18
        );

      page.drawText(
        organization,
        {
          x: (width - orgWidth) / 2,
          y: height - 105,
          size: 18,
          font: boldFont,
          color: purple
        }
      );


      /*
       * Certificate heading
       */

      const heading =
        "CERTIFICATE";

      const headingWidth =
        boldFont.widthOfTextAtSize(
          heading,
          38
        );

      page.drawText(
        heading,
        {
          x: (width - headingWidth) / 2,
          y: height - 160,
          size: 38,
          font: boldFont,
          color: dark
        }
      );


      const subheading =
        "OF COURSE COMPLETION";

      const subWidth =
        regularFont.widthOfTextAtSize(
          subheading,
          14
        );

      page.drawText(
        subheading,
        {
          x: (width - subWidth) / 2,
          y: height - 187,
          size: 14,
          font: regularFont,
          color: muted
        }
      );


      /*
       * Presented to
       */

      const presented =
        "This certificate is proudly presented to";

      const presentedWidth =
        italicFont.widthOfTextAtSize(
          presented,
          13
        );

      page.drawText(
        presented,
        {
          x: (width - presentedWidth) / 2,
          y: height - 235,
          size: 13,
          font: italicFont,
          color: muted
        }
      );


      /*
       * User name
       */

      const name =
        certificate.name;

      const nameFontSize =
        name.length > 35
          ? 28
          : 34;

      const nameWidth =
        boldFont.widthOfTextAtSize(
          name,
          nameFontSize
        );

      page.drawText(
        name,
        {
          x: (width - nameWidth) / 2,
          y: height - 290,
          size: nameFontSize,
          font: boldFont,
          color: purple
        }
      );


      /*
       * Name underline
       */

      page.drawLine({
        start: {
          x: 180,
          y: height - 305
        },

        end: {
          x: width - 180,
          y: height - 305
        },

        thickness: 1,

        color: gold
      });


      /*
       * Completion text
       */

      const completionText =
        "has successfully completed the course";

      const completionWidth =
        regularFont.widthOfTextAtSize(
          completionText,
          13
        );

      page.drawText(
        completionText,
        {
          x: (width - completionWidth) / 2,
          y: height - 340,
          size: 13,
          font: regularFont,
          color: dark
        }
      );


      /*
       * Course name
       */

      const courseName =
        certificate.course;

      const courseFontSize =
        courseName.length > 45
          ? 19
          : 23;

      const courseWidth =
        boldFont.widthOfTextAtSize(
          courseName,
          courseFontSize
        );

      page.drawText(
        courseName,
        {
          x: (width - courseWidth) / 2,
          y: height - 375,
          size: courseFontSize,
          font: boldFont,
          color: dark
        }
      );


      /*
       * Course details
       */

      const details =
        `${certificate.duration} • ${certificate.instructor}`;

      const detailsWidth =
        regularFont.widthOfTextAtSize(
          details,
          11
        );

      page.drawText(
        details,
        {
          x: (width - detailsWidth) / 2,
          y: height - 400,
          size: 11,
          font: regularFont,
          color: muted
        }
      );


      /*
       * Issue date
       */

      const issueDate =
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


      page.drawText(
        `Issued on: ${issueDate}`,
        {
          x: 75,
          y: 75,
          size: 10,
          font: regularFont,
          color: muted
        }
      );


      /*
       * Certificate ID
       */

      page.drawText(
        `Certificate ID: ${certificate.id}`,
        {
          x: 75,
          y: 58,
          size: 10,
          font: boldFont,
          color: dark
        }
      );


      /*
       * Verification text
       */

      const verification =
        "Verify this certificate using the Certificate ID.";

      page.drawText(
        verification,
        {
          x: width - 310,
          y: 75,
          size: 9,
          font: regularFont,
          color: muted
        }
      );


      /*
       * Seal
       */

      page.drawCircle({
        x: width - 100,
        y: 120,
        size: 34,
        borderColor: gold,
        borderWidth: 2,
        color: lightPurple
      });

      const sealText =
        "VERIFIED";

      const sealWidth =
        boldFont.widthOfTextAtSize(
          sealText,
          8
        );

      page.drawText(
        sealText,
        {
          x:
            width -
            100 -
            sealWidth / 2,

          y: 117,

          size: 8,

          font: boldFont,

          color: purple
        }
      );


      /*
       * Generate PDF
       */

      const pdfBytes =
        await pdfDoc.save();


      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="certificate-${certificate.id}.pdf"`
      );


      res.send(
        Buffer.from(pdfBytes)
      );

    } catch (error) {

      console.error(
        "PDF generation error:",
        error
      );

      res.status(500).json({
        error:
          "Failed to generate certificate PDF"
      });

    }

  }
);


/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {

  res.json({
    status: "ok",
    service: "certificate-generator"
  });

});


/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

app.listen(
  PORT,
  () => {

    console.log(
      `Certificate Generator running on port ${PORT}`
    );

    console.log(
      `Open http://localhost:${PORT}`
    );

  }
);