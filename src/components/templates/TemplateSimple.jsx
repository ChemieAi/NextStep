import React, { forwardRef } from "react";

const TemplateSimple = forwardRef(({ data }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white text-black p-10 w-[820px] min-h-[1123px] text-sm leading-relaxed"
    >
      {/* Header */}
      {data.showProfileImage && data.profileImage && (
        <img
          src={data.profileImage}
          alt="Profil Fotoğrafı"
          className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
        />
      )}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-wide mb-1 uppercase ">{data.name}</h1>
        <p className="text-lg text-gray-700 mb-1">{data.title}</p>
        <p className="text-gray-600 text-sm">
          {data.email} | {data.phone} | {data.city}
        </p>
      </div>

      {/* Education */}
      {data.education?.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-lg border-b pb-1 mb-2">Education</h2>
          {data.education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <p className="font-semibold">
                {edu.school}, {edu.country}
              </p>
              <p className="text-sm text-gray-700">
                {edu.startMonth}/{edu.startYear} - {edu.endMonth}/{edu.endYear}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-lg border-b pb-1 mb-2">Experience</h2>
          {data.experience.map((exp, idx) => (
            <div key={idx} className="mb-2">
              <p className="font-semibold">
                {exp.company} – {exp.position}
              </p>
              <p className="text-sm text-gray-700">
                {exp.startMonth}/{exp.startYear} - {exp.endMonth}/{exp.endYear}
              </p>
              <p className="text-gray-800">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div className="mb-6">
          <h2 className="font-bold text-lg border-b pb-1 mb-2">Skills</h2>
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
        <div className="mb-6">
          <h2 className="font-bold text-lg border-b pb-1 mb-2">Languages</h2>
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
        <div>
          <h2 className="font-bold text-lg border-b pb-1 mb-2">Projects</h2>
          {data.projects.map((p, i) => (
            <div key={i} className="mb-2">
              <p className="font-semibold">{p.title}</p>
              <p className="text-gray-800">{p.description}</p>
              {p.link && (
                <a
                  href={p.link}
                  className="text-blue-600 underline text-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  {p.link}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default TemplateSimple;
