const StepBasicInfo = ({ data, setData }) => {
    const handleChange = (e) =>
      setData({ ...data, [e.target.name]: e.target.value });
  
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium block mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-gray-50"
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Job Title</label>
          <input
            type="text"
            name="title"
            value={data.title}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-gray-50"
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-gray-50"
          />
        </div>
        <div>
          <label className="font-medium block mb-1">City</label>
          <input
            type="text"
            name="city"
            value={data.city}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-gray-50"
          />
        </div>
        <div>
          <label className="font-medium block mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded bg-gray-50"
          />
        </div>
  
        {/* Profil resmi placeholder */}
        <div className="col-span-2 flex justify-center mt-4">
          <div className="bg-orange-500 text-white w-32 h-32 rounded-full flex items-center justify-center text-center text-sm">
            Add Photo<br />(coming soon)
          </div>
        </div>
      </div>
    );
  };
  
  export default StepBasicInfo;
  