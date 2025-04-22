import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Örnek bir font (gerekirse özel font da ekleyebiliriz)
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helvetica/v16/FjBkMkXDNJs9H0IYT9RURQ.ttf" },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
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
    marginBottom: 4,
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
    marginBottom: 4,
  },
  skillItem: {
    display: "inline-block",
    marginRight: 6,
    padding: "2px 6px",
    border: "1px solid #aaa",
    borderRadius: 4,
    fontSize: 9,
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
                  {edu.school}, {edu.country}
                </Text>
                <Text style={styles.itemText}>
                  {edu.startMonth}/{edu.startYear} - {edu.endMonth}/{edu.endYear}
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
                  {exp.startMonth}/{exp.startYear} - {exp.endMonth}/{exp.endYear}
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
