import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image,
    Link,
} from "@react-pdf/renderer";

// Font kaydı
Font.register({
    family: "Roboto",
    fonts: [
        { src: "/fonts/static/Roboto-Regular.ttf" },
        { src: "/fonts/static/Roboto-Bold.ttf", fontWeight: "bold" },
    ],
});

// Stil tanımları
const styles = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        fontSize: 11,
        padding: 40,
        lineHeight: 1.6,
        backgroundColor: "#fff",
        color: "#333",
    },
    rowHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        gap: 12,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
        objectFit: "cover",   // 📌 Bu satır basıklığı engeller
    },
    headerInfo: {
        flexDirection: "column",
        textAlign: "center"
    },
    centeredHeader: {
        textAlign: "center",
        marginBottom: 12,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textTransform: "uppercase",
        textAlign: "center",
    },
    title: {
        fontSize: 12,
        marginBottom: 4,
        textAlign: "center",
    },
    contact: {
        fontSize: 10,
        color: "#555",
        textAlign: "center",
    },
    separator: {
        marginBottom: 7,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
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
        flexDirection: "row",
        marginRight: 6,
        marginBottom: 4,
        paddingHorizontal: 6,
        paddingVertical: 3,
        border: "1px solid #aaa",
        borderRadius: 4,
        fontSize: 9,
        alignItems: "center",
        justifyContent: "center",
    },
});

const CvPdf_2 = ({ formData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* HEADER */}
            {formData.showProfileImage && formData.profileImageBase64 ? (
                <View style={styles.rowHeader}>
                    <Image src={formData.profileImageBase64} style={styles.image} />
                    <View style={styles.headerInfo}>
                        <Text style={styles.name}>{formData.name}</Text>
                        <Text style={styles.title}>{formData.title}</Text>
                    </View>
                </View>
            ) : (
                <View style={styles.centeredHeader}>
                    <Text style={styles.name}>{formData.name}</Text>
                    <Text style={styles.title}>{formData.title}</Text>
                </View>
            )}

            <View style={styles.separator} />
            <Text style={styles.contact}>
                {formData.email} | {formData.phone} | {formData.city}
            </Text>
            <View style={styles.separator} />
            <View style={{ color: "white", marginBottom: "16" }} />
            {/* SUMMARY */}
            {formData.summary && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Summary</Text>
                    <Text style={styles.itemText}>{formData.summary}</Text>
                </View>
            )}

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
                                {edu.startMonth}/{edu.startYear} -{" "}
                                {edu.currently ? "Devam ediyor" : `${edu.endMonth}/${edu.endYear}`}
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
                                {exp.startMonth}/{exp.startYear} -{" "}
                                {exp.currently ? "Devam ediyor" : `${exp.endMonth}/${exp.endYear}`}
                            </Text>
                            <Text style={styles.itemText}>{exp.description}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* SKILLS */}
            {formData.skills?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills</Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        {formData.skills.map((skill, i) => (
                            <View key={i} style={styles.skillItem}>
                                <Text wrap={false}>{skill}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* LANGUAGES */}
            {formData.languages?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Languages</Text>
                    {formData.languages.map((lang, i) => (
                        <Text key={i} style={styles.itemText}>
                            {lang.name} – {lang.level}
                        </Text>
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
                                <Text src={p.link} style={{ color: "blue" }}>
                                    {p.link}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* SOCIALS */}
            {formData.socials?.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Socials</Text>
                    {formData.socials.map((s, i) => (
                        <Text key={i} src={s.url} style={{ color: "blue", marginBottom: 3 }}>
                            {s.name}
                        </Text>
                    ))}
                </View>
            )}
        </Page>
    </Document>
);

export default CvPdf_2;
