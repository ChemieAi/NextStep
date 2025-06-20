import React, { forwardRef } from "react";

const TemplateSimple_2 = forwardRef(({ data }, ref) => {
    return (
        <div
            ref={ref}
            className="bg-white text-black p-10 w-[820px] min-h-[1123px] text-sm leading-relaxed font-sans"
        >
            {/* Header */}
            {data.showProfileImage && data.profileImage ? (
                <div className="flex items-center gap-6 mb-6">
                    <img
                        src={data.profileImage}
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-full border"
                    />
                    <div className="text-center ">
                        <h1 className="text-4xl font-bold tracking-wide mb-1 uppercase mr-6">{data.name}</h1>
                        <p className="text-lg text-gray-700 mb-1">{data.title}</p>
                    </div>
                </div>
            ) : (
                <div className="text-center mb-7">
                    <h1 className="text-4xl font-bold tracking-wide mb-1 uppercase ">{data.name}</h1>
                    <p className="text-lg text-gray-700 mb-1">{data.title}</p>
                </div>
            )}

            <hr className="border-t border-gray-300 my-2" />
            <p className="text-sm text-gray-600 mb-0">
                {data.email} | {data.phone} | {data.city}
            </p>
            <hr className="border-t border-gray-300 my-2 mb-7" />

            {/* Summary */}
            {data.summary && (
                <div className="mb-5">
                    <h2 className="font-bold text-lg border-b border-gray-300 pb-1 mb-2 text-left">Summary</h2>
                    <p className="text-sm text-left text-gray-700 mb-4">{data.summary}</p>
                </div>
            )}

            {/* Education */}
            {data.education?.length > 0 && (
                <div className="mb-5">
                    <h2 className="font-bold text-lg border-b border-gray-300 pb-1 mb-2">Education</h2>
                    {data.education.map((edu, idx) => (
                        <div key={idx} className="mb-2">
                            <p className="font-bold mb-1 text-left text-gray-700">
                                {edu.school}, {edu.department}
                            </p>
                            <p className="text-sm mb-1 text-gray-700 text-left">
                                {edu.startMonth}/{edu.startYear} - {edu.currently ? "Devam ediyor" : `${edu.endMonth}/${edu.endYear}`}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Experience */}
            {data.experience?.length > 0 && (
                <div className="mb-5">
                    <h2 className="font-bold text-lg border-b border-gray-300 pb-1 mb-2">Experience</h2>
                    {data.experience.map((exp, idx) => (
                        <div key={idx} className="mb-2">
                            <p className="font-bold mb-1 text-left text-gray-700">
                                {exp.company} – {exp.position}
                            </p>
                            <p className="text-sm text-gray-700 text-left mb-1">
                                {exp.startMonth}/{exp.startYear} -{" "} {exp.currently ? "Devam ediyor" : `${exp.endMonth}/${exp.endYear}`}
                            </p>
                            <p className="text-gray-800 mb-1 text-left">{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {data.skills?.length > 0 && (
                <div className="mb-5">
                    <h2 className="font-bold text-lg border-b border-gray-300 pb-1 mb-2">Skills</h2>
                    <ul className="flex flex-wrap gap-2">
                        {data.skills.map((skill, idx) => (
                            <li key={idx} className="px-2 py-1 border rounded">
                                {skill}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Languages */}
            {data.languages?.length > 0 && (
                <div className="mb-5">
                    <h2 className="font-bold text-lg border-b border-gray-300 pb-1 mb-2">Languages</h2>
                    <ul>
                        {data.languages.map((lang, idx) => (
                            <li key={idx}>
                                {lang.name} – {lang.level}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Projects */}
            {data.projects?.length > 0 && (
                <div className="mb-5">
                    <h2 className="font-bold text-lg border-b border-gray-300 pb-1 mb-2">Projects</h2>
                    {data.projects.map((p, i) => (
                        <div key={i} className="mb-2">
                            <p className="font-bold mb-0 text-left text-gray-700">{p.title}</p>
                            <p className="text-gray-800 mb-0 text-left">{p.description}</p>
                            {p.link && (
                                <a
                                    href={p.link}
                                    className="text-blue-600 underline text-sm text-left"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {p.link}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {/* Social Links */}
            {data.socials?.length > 0 && (
                <div className="mb-5">
                    <h2 className="font-bold text-lg border-b border-gray-300 pb-1 mb-2">Socials</h2>
                    {data.socials.map((social, i) => (
                        <div key={i} className="mb-1">
                            <a
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-sm"
                            >
                                {social.name}
                            </a>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
});

export default TemplateSimple_2;