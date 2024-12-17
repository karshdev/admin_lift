const VideoManagement = () => {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Video Management</h2>
        <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-md">
          Upload Video
        </button>
        <div className="bg-white rounded-md shadow-md p-4">
          <p>No videos uploaded yet.</p>
        </div>
      </div>
    );
  };
  
  export default VideoManagement;
  