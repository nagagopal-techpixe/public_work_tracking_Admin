import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getWorkById,
  deleteAndReplaceImages,
  deleteAndReplaceVideos,
  deleteAndReplaceDocuments,
  updateWork
} from "../../api/worksApi";
import EditModal from "./EditModal";
import LocationEdit from "./LocationEdit";
const WorkDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(null);
  const [editWork, setEditWork] = useState({});
  const fileInputRefs = useRef({});
  const [viewMedia, setViewMedia] = useState({
  open: false,
  type: "",
  url: "",
});

const handleViewMedia = (type, index) => {
  let url = "";

  if (type === "images") {
    url = work.images[index];
  } else if (type === "videos") {
    url = work.videos[index];
  } else if (type === "documents") {
    url = work.documents[index];
  }

  if (!url) return;

  // handle relative paths
  if (!url.startsWith("http")) {
    url = `/${url}`;
  }

  setViewMedia({
    open: true,
    type,
    url,
  });
};

  
  const handleAddMedia = async (type, files) => {
  if (!files || files.length === 0) return;

  const formData = new FormData();
  let apiCall, mediaKey = "";

  switch (type) {
    case "images":
      mediaKey = "workimages";
      apiCall = deleteAndReplaceImages;
      break;
    case "videos":
      mediaKey = "videos";
      apiCall = deleteAndReplaceVideos;
      break;
    case "documents":
      mediaKey = "documents";
      apiCall = deleteAndReplaceDocuments;
      break;
    default:
      return;
  }

  // required empty fields
  formData.append("deletemedia_ids", "");
  formData.append("replacemedia_ids", "");

  Array.from(files).forEach(file => {
    formData.append(mediaKey, file);
  });

  try {
    await apiCall(id, formData);
    toast.success(`${type} added successfully`);
    fetchWork();
  } catch (err) {
    console.error(err);
    toast.error(`Failed to add ${type}`);
  }
};



  // Fetch work
  
  const fetchWork = async () => {
    try {
      setLoading(true);
      const res = await getWorkById(id);
      if (res.data?.success) setWork(res.data.data[0]);
      else toast.error(res.data?.message || "Failed to fetch work");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch work details");
      navigate("/works");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWork(); }, [id]);

  /** Media Handlers (delete/replace) **/
  const handleDeleteMedia = async (type, index) => {
    if (!window.confirm(`Delete this ${type.slice(0, -1)}?`)) return;
    const formData = new FormData();
    let apiCall;
    switch(type){
      case "images": formData.append("deletemedia_ids", index); apiCall=deleteAndReplaceImages; break;
      case "videos": formData.append("deletedvideos_ids", index); apiCall=deleteAndReplaceVideos; break;
      case "documents": formData.append("deletedocs_ids", index); apiCall=deleteAndReplaceDocuments; break;
      default: return;
    }
    try { await apiCall(id, formData); toast.success(`${type.slice(0,-1)} deleted`); fetchWork(); }
    catch(err){ console.error(err); toast.error("Delete failed"); }
  };

  const triggerReplace = (type, index) => fileInputRefs.current[`${type}-${index}`]?.click();

  const handleReplaceMedia = async (type, index, file) => {
    if(!file) return;
    const formData = new FormData();
    let apiCall, deleteKey="", replaceKey="", mediaKey="";
    switch(type){
      case "images": deleteKey="deletemedia_ids"; replaceKey="replacemedia_ids"; mediaKey="workimages"; apiCall=deleteAndReplaceImages; break;
      case "videos": deleteKey="deletedvideos_ids"; replaceKey="replacevideos_ids"; mediaKey="videos"; apiCall=deleteAndReplaceVideos; break;
      case "documents": deleteKey="deletedocs_ids"; replaceKey="replacedocs_ids"; mediaKey="documents"; apiCall=deleteAndReplaceDocuments; break;
      default: return;
    }
    formData.append(deleteKey, ''); formData.append(replaceKey, index); formData.append(mediaKey, file);
    try{ await apiCall(id, formData); toast.success(`${type.slice(0,-1)} replaced`); fetchWork(); }
    catch(err){ console.error(err); toast.error("Replace failed"); }
  };

  const renderMediaSection = (type, items) => {
    if(!items || items.length===0) return null;
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{type.charAt(0).toUpperCase()+type.slice(1)}</h3>
        </div>
        <div className={`grid gap-4 ${type==="documents"?"grid-cols-1":"grid-cols-2 md:grid-cols-3"}`}>
          {items.map((item,index)=>(
            <div key={index} className="relative group bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
               <button
    onClick={() => handleViewMedia(type, index)}
    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
    title="View"
  >
    👁️
  </button>
              <button onClick={()=>handleDeleteMedia(type,index)} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">🗑️</button>
               
               <button onClick={()=>triggerReplace(type,index)} className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700">🔄</button>
              </div>
              {type==="images"?(<img src={item.startsWith("http")?item:`/${item}`} className="w-full h-48 object-contain" alt=""/>) :
               type==="videos"?(<video src={item.startsWith("http")?item:`/${item}`} className="w-full h-48 object-cover" controls/>) :
               (<div className="p-2">{item.split("/").pop()}</div>)}
              <input type="file" className="hidden" ref={el=>fileInputRefs.current[`${type}-${index}`]=el} onChange={e=>handleReplaceMedia(type,index,e.target.files[0])}/>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if(loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if(!work) return <div className="text-center py-12">Work not found</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={()=>navigate("/Works/view-works")} className="text-blue-600 hover:underline flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg> Back to Works
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
  {/* Title & Description */}
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-start mb-4">
      <h2 className="text-2xl font-bold">{work.title}</h2>
      <button
        onClick={() => {
          setEditWork({ title: work.title, description: work.description });
          setShowEditModal("titleDesc");
        }}
        className="text-blue-600 text-sm hover:underline"
      >
        ✏️
      </button>
    </div>
    <p className="text-gray-600 whitespace-pre-wrap">{work.description}</p>
  </div>

  {/* Images Section */}
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">Images</h3>
      <button
  onClick={() => fileInputRefs.current["add-images"]?.click()}
  className="px-4 py-1.5 rounded-md bg-black text-white text-sm hover:bg-gray-800"
>
  Add Images
</button>

<input
  type="file"
  accept="image/*"
  multiple
  className="hidden"
  ref={el => (fileInputRefs.current["add-images"] = el)}
  onChange={e => handleAddMedia("images", e.target.files)}
/>

    </div>
    {renderMediaSection("images", work.images)}
  </div>

  {/* Videos Section */}
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">Videos</h3>
      <button
  onClick={() => fileInputRefs.current["add-videos"]?.click()}
  className="px-4 py-1.5 rounded-md bg-black text-white text-sm hover:bg-gray-800"
>
  Add Videos
</button>

<input
  type="file"
  accept="video/*"
  multiple
  className="hidden"
  ref={el => (fileInputRefs.current["add-videos"] = el)}
  onChange={e => handleAddMedia("videos", e.target.files)}
/>

    </div>
    {renderMediaSection("videos", work.videos)}
  </div>

  {/* Documents Section */}
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="text-xl font-semibold">Documents</h3>
      <button
  onClick={() => fileInputRefs.current["add-documents"]?.click()}
  className="px-4 py-1.5 rounded-md bg-black text-white text-sm hover:bg-gray-800"
>
  Add Documents
</button>

<input
  type="file"
  multiple
  className="hidden"
  ref={el => (fileInputRefs.current["add-documents"] = el)}
  onChange={e => handleAddMedia("documents", e.target.files)}
/>

    </div>
    {renderMediaSection("documents", work.documents)}
  </div>
</div>


        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-900">Status</h3>
              <button onClick={()=>{setEditWork({status:work.status,verified:work.verified}); setShowEditModal("status");}} className="text-blue-600 text-sm hover:underline">✏️</button>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${work.status==="completed"?"bg-green-100 text-green-700":work.status==="in_progress"?"bg-blue-100 text-blue-700":work.status==="planned"?"bg-yellow-100 text-yellow-700":"bg-gray-100 text-gray-700"}`}>
              {work.status?.replace("_"," ")}
            </div>
            {work.verified === true && (
  <span className="ml-2 text-green-600">✅ Verified</span>
)}

{work.verified === false && (
  <span className="ml-2 text-red-600">❌ Unverified</span>
)}

          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Location Info</h3>
              {/* <button onClick={()=>{setEditWork({constituency:work.constituencydata?.[0]?.constituency_name || "",mandal_name:work.mandaldata?.[0]?.mandal_name||"",village_name:work.villagedata?.[0]?.village_name||"",habitation_name:work.habitationdata?.[0]?.habitation_name||""}); setShowEditModal("location");}} className="text-blue-600 text-sm hover:underline">✏️</button> */}
           <button
  onClick={() => {
    setEditWork({
      constituency_id: work.constituencydata?.[0]?._id || "",
      mandal_id: work.mandaldata?.[0]?._id || "",
      village_id: work.villagedata?.[0]?._id || "",
      habitation_id: work.habitationdata?.[0]?._id || "",

      constituency_name: work.constituencydata?.[0]?.constituency_name || "",
      mandal_name: work.mandaldata?.[0]?.mandal_name || "",
      village_name: work.villagedata?.[0]?.village_name || "",
      habitation_name: work.habitationdata?.[0]?.habitation_name || "",

      // REQUIRED for constituency dropdown
      constituencies: work.constituencies,
    });

    setShowEditModal("location");
  }}
  className="text-blue-600 text-sm hover:underline"
>
  ✏️
</button>

            </div>
            <div className="space-y-2">
              <div><b>constituency:</b> {work.constituencydata?.[0]?.constituency_name || "-"}</div>
              <div><b>Mandal:</b> {work.mandaldata?.[0]?.mandal_name || "-"}</div>
              <div><b>Village:</b> {work.villagedata?.[0]?.village_name || "-"}</div>
              <div><b>Habitation:</b> {work.habitationdata?.[0]?.habitation_name || "-"}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Financial Info</h3>
              <button onClick={()=>{setEditWork({budgetAmount:work.budgetAmount,fundSource:work.fundSource}); setShowEditModal("financial");}} className="text-blue-600 text-sm hover:underline">✏️</button>
            </div>
            <div className="space-y-2">
              <div><b>Budget:</b> ₹{work.budgetAmount?.toLocaleString()||"-"}</div>
              <div><b>Fund Source:</b> {work.fundSource||"-"}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Work Info</h3>
            <div className="space-y-2">
              <div><b>Work ID:</b> {work._id}</div>
              <div><b>Created Date:</b> {new Date(work.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
  showModal={showEditModal}
  onClose={() => setShowEditModal(null)}
  editWork={editWork}
  setEditWork={setEditWork}
  onSave={async () => {
    await updateWork(id, editWork);
    toast.success("Updated");
    setShowEditModal(null);
    fetchWork();
  }}
>
  {showEditModal === "location" && (
    <LocationEdit
      editWork={editWork}
      setEditWork={setEditWork}
      isOpen={true}
    />
  )}
</EditModal>

 
{viewMedia.open && (
<div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">

    <div className="bg-white rounded-lg max-w-4xl w-full relative">
      
      {/* Close */}
      <button
        onClick={() => setViewMedia({ open: false, type: "", url: "" })}
        className="absolute top-2 right-2 text-xl cursor-pointer"

      >
        ✖️
      </button>

      {/* CONTENT */}
      <div className="p-4 flex justify-center items-center">
        {viewMedia.type === "images" && (
          <img
            src={viewMedia.url}
            alt="view"
            className="max-h-[80vh] object-contain"
          />
        )}

        {viewMedia.type === "videos" && (
          <video
            src={viewMedia.url}
            controls
            className="max-h-[80vh] w-full"
          />
        )}

        {viewMedia.type === "documents" && (
          <iframe
            src={viewMedia.url}
            title="document"
            className="w-full h-[80vh]"
          />
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default WorkDetailsPage;
