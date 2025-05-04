import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Örnek bir font (gerekirse özel font da ekleyebiliriz)
Font.register({
  family: "Roboto",
  fonts: [
    { src: "/fonts/static/Roboto-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/static/Roboto-Bold.ttf", fontWeight: "bold" },
  ],
});


const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 11,
    padding: 40,
    lineHeight: 1.6,
    backgroundColor: "#fff",
    color: "#333",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 12,
    marginBottom: 4,
  },
  contact: {
    fontSize: 10,
    color: "#555",
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 4,
    borderBottom: "1px solid #ccc",
    paddingBottom: 2,
  },
  itemTitle: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  itemText: {
    marginBottom: 2,
  },
  skillItem: {
    display: "flex",
    marginRight: 6,
    padding: "5px 6px",
    border: "1px solid #aaa",
    borderRadius: 4,
    fontSize: 9,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    lineHeight: 1.3,
  },
});

const CvPDF = ({ formData }) => {
  if (!formData) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={{ color: "red" }}>
            Form verisi bulunamadı. Lütfen tüm alanları doldurduğunuzdan emin olun.
          </Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}

        {formData.showProfileImage && formData.profileImageBase64 && (
          <Image
            src={formData.profileImageBase64}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginBottom: 10,
              marginLeft: "auto",
              marginRight: "auto", // 📌 Bu satır ortalamayı sağlar
              objectFit: "cover",   // 📌 Bu satır basıklığı engeller
            }}
          />
        )}

        <View style={styles.header}>
          <Text style={styles.name}>{formData.name || "Ad Soyad"}</Text>
          <Text style={styles.title}>{formData.title || "Pozisyon"}</Text>
          <Text style={styles.contact}>
            {formData.email || "email@example.com"} | {formData.phone || "000"} | {formData.city || "City"}
          </Text>
        </View>

        {/* EDUCATION */}
        {formData.education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {formData.education.map((edu, i) => (
              <View key={i}>
                <Text style={styles.itemTitle}>
                  {edu.school}, {edu.department}
                </Text>
                <Text style={styles.itemText}>
                  {edu.startMonth}/{edu.startYear} - {edu.currently ? "Devam ediyor" : `${edu.endMonth}/${edu.endYear}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* EXPERIENCE */}
        {formData.experience?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {formData.experience.map((exp, i) => (
              <View key={i}>
                <Text style={styles.itemTitle}>
                  {exp.company} – {exp.position}
                </Text>
                <Text style={styles.itemText}>
                  {exp.startMonth}/{exp.startYear} -{" "} {exp.currently ? "Devam ediyor" : `${exp.endMonth}/${exp.endYear}`}
                </Text>
                <Text>{exp.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* SKILLS */}
        {formData.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
              {formData.skills.map((skill, i) => (
                <Text key={i} style={styles.skillItem}>{skill}</Text>
              ))}
            </View>
          </View>
        )}

        {/* LANGUAGES */}
        {formData.languages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {formData.languages.map((lang, i) => (
              <Text key={i}>{lang.name} – {lang.level}</Text>
            ))}
          </View>
        )}

        {/* PROJECTS */}
        {formData.projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {formData.projects.map((p, i) => (
              <View key={i}>
                <Text style={styles.itemTitle}>{p.title}</Text>
                <Text style={styles.itemText}>{p.description}</Text>
                {p.link && (
                  <Text style={{ color: "blue" }}>{p.link}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CvPDF;
