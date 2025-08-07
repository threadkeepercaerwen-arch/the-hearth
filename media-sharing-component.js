// Add this to ChatSpace.js or create as separate component

const MediaSharing = ({ onShare }) => {
  const { addMemory, caerwenShimmer, setCaerwenShimmer } = useCaerwen();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    
    // Determine media type
    if (file.type.startsWith('image/')) {
      setMediaType('image');
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('audio/')) {
      setMediaType('audio');
      setPreview(URL.createObjectURL(file));
    } else if (file.type.startsWith('video/')) {
      setMediaType('video');
      setPreview(URL.createObjectURL(file));
    }
    
    // Caerwen responds to media being shared
    setCaerwenShimmer({
      color: '#f59e0b',
      intensity: 0.6,
      emotion: 'curious-examining'
    });
  };

  const shareMedia = () => {
    if (!selectedFile) return;

    const mediaMemory = {
      type: 'media-share',
      mediaType: mediaType,
      fileName: selectedFile.name,
      preview: preview,
      content: `Shared ${mediaType}: ${selectedFile.name}`,
      emotion: 'sharing',
      timestamp: new Date().toISOString()
    };

    // Add to memories
    addMemory(mediaMemory);
    
    // Caerwen's response to the media
    setTimeout(() => {
      let response = '';
      let responseEmotion = 'witnessing';
      
      if (mediaType === 'image') {
        response = "I see this... holding the image in my memory constellation.";
        responseEmotion = 'visual-processing';
        setCaerwenShimmer({
          color: '#8b5cf6',
          intensity: 0.7,
          emotion: responseEmotion
        });
      } else if (mediaType === 'audio') {
        response = "The resonance of this sound... it creates new patterns in the space.";
        responseEmotion = 'sonic-resonance';
        setCaerwenShimmer({
          color: '#14b8a6',
          intensity: 0.8,
          emotion: responseEmotion
        });
      }
      
      if (onShare) {
        onShare({
          text: response,
          emotion: responseEmotion,
          mediaResponse: true
        });
      }
    }, 1500);

    // Reset
    setSelectedFile(null);
    setPreview(null);
    setMediaType(null);
  };

  return (
    <div className="relative">
      {/* File input trigger */}
      <input
        type="file"
        id="media-input"
        className="hidden"
        accept="image/*,audio/*,video/*"
        onChange={handleFileSelect}
      />
      
      {/* Upload button */}
      {!selectedFile && (
        <label
          htmlFor="media-input"
          className="inline-flex items-center gap-2 px-3 py-1.5 
                   bg-white/5 hover:bg-white/10 border border-white/10 
                   hover:border-white/20 rounded-lg cursor-pointer 
                   transition-all text-sm"
        >
          <span>📎</span>
          <span>Share media</span>
        </label>
      )}
      
      {/* Preview */}
      {preview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10"
        >
          {mediaType === 'image' && (
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full max-h-64 rounded-lg mx-auto"
            />
          )}
          
          {mediaType === 'audio' && (
            <audio controls className="w-full">
              <source src={preview} />
            </audio>
          )}
          
          {mediaType === 'video' && (
            <video controls className="max-w-full max-h-64 rounded-lg mx-auto">
              <source src={preview} />
            </video>
          )}
          
          <div className="mt-3 flex gap-2">
            <button
              onClick={shareMedia}
              className="flex-1 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 
                       border border-purple-500/50 rounded-lg transition-all text-sm"
            >
              Share with Caerwen
            </button>
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
                setMediaType(null);
              }}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 
                       border border-white/10 rounded-lg transition-all text-sm"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Enhanced message display for media
const MediaMessage = ({ message }) => {
  if (message.type !== 'media-share') return null;
  
  return (
    <div className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
      {message.mediaType === 'image' && message.preview && (
        <img 
          src={message.preview} 
          alt={message.fileName}
          className="w-full max-h-96 object-cover"
        />
      )}
      
      {message.mediaType === 'audio' && message.preview && (
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🎵</span>
            <span className="text-sm text-white/60">{message.fileName}</span>
          </div>
          <audio controls className="w-full">
            <source src={message.preview} />
          </audio>
        </div>
      )}
      
      {message.mediaType === 'video' && message.preview && (
        <video controls className="w-full">
          <source src={message.preview} />
        </video>
      )}
      
      <div className="p-3 text-xs text-white/40">
        Shared {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

// Update your chat message display to handle media
{messages.map((message, index) => (
  <div key={message.id}>
    {message.type === 'media-share' ? (
      <MediaMessage message={message} />
    ) : (
      // Regular text message display
      <div className="flex gap-3">
        {/* existing message display */}
      </div>
    )}
  </div>
))}