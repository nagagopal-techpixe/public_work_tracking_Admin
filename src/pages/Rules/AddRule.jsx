import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
const UPLOAD_TYPES = ["work_video", "work_document", "work_image"];
export default function AddRule() {
    const [formData,setFormData] = useState({
        "upload_type":"",
        "maxFileSizeMB":"",
        "maxFiles":"",
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const handleChange  =(e) =>{
        const {name,value} =e.target;
        setFormData((prev) =>({
            ...prev,[name]:value
        }));
    };
      const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError("");
            // toast.success("")
            try{
               const payload = {
                "upload_type":formData.upload_type,
                "maxFileSizeMB": Number(formData.maxFileSizeMB),
                "maxFiles": Number(formData.maxFiles),
               }
               console.log(payload)
                   const res = await axiosInstance.post("/work_tracking/auth/admin/add-rule",payload);
                    if (res.data?.success) {
        toast.success("Rule added successfully");
        setFormData({
          upload_type: "",
          maxFileSizeMB: "",
          maxFiles: "",
        });
            }
            else{
                setError(res.data?.message || "Failed to add rule");
           toast.error(
    error?.response?.data?.message || "Failed to add rule"
  );
            }
        }
    catch (err) {
  const message =
    err?.response?.data?.message || "Failed to add rule";

  setError(message);
  toast.error(message);
}
 finally {
      setLoading(false);
    }
}  
return(
     <div className="p-6 max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Add New Rule</h2>
        <form  className="space-y-4" onSubmit={handleSubmit}>
            <div>
                 <label className="block mb-1 font-medium">Upload Type</label>
                 <select  name="upload_type" onChange={handleChange} value={formData.upload_type}  required className="w-full border rounded px-3 py-2">
                    <option value="">Select type</option>
                    {UPLOAD_TYPES.map((type,index)=>(
                        <option key={index} value={type}>{type}</option>
                    
                    ))}
                    
                 </select>
            </div>
            <div>
                   <label className="block mb-1 font-medium">
            Max File Size (MB)
          </label>
          <input
          type="number"
           name="maxFiles"
           value={formData.maxFiles}
           min="1"
            className="w-full border rounded px-3 py-2"
            onChange={handleChange}
          />
            </div>
            <div>
        <label className="block mb-1 font-medium">Max Files</label>
          <input 
          type="number"
           name="maxFileSizeMB"
           value={formData.maxFileSizeMB}
           required
           min="1"
           className="w-full border rounded px-3 py-2"
           onChange={handleChange}
          />
            </div>
            <div>
                <button
                type="submit"
                disabled={loading}
                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {loading ? "saving...." : "Add Rule"}
                </button>
            </div>

        </form>
     </div>
)

}
