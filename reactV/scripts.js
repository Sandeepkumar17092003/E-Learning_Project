document.addEventListener('DOMContentLoaded', function () {
    const videoList = document.getElementById('video_list');
    const videoFrame = document.getElementById('video');
    const videoTitle = document.getElementById('video_title');
    const videoDesc = document.getElementById('video_desc');

    // Function to extract video ID from YouTube URL
    function getYouTubeVideoId(url) {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('v');
    }

    // Function to update the video player and description
    function updateVideo(videoUrl, title, description) {
        const videoId = getYouTubeVideoId(videoUrl);
        videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
        videoTitle.textContent = title;
        videoDesc.textContent = description;

        // Highlight the active video in the list
        const listItems = videoList.querySelectorAll('li');
        listItems.forEach(item => {
            const link = item.querySelector('a');
            if (link.getAttribute('data-video-url') === videoUrl) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Set the first video as the default video on page load
    const firstVideo = videoList.querySelector('a');
    if (firstVideo) {
        const videoUrl = firstVideo.getAttribute('data-video-url');
        const title = firstVideo.getAttribute('data-title');
        const description = firstVideo.getAttribute('data-desc');

        updateVideo(videoUrl, title, description);
    }

    // Event listener for video list clicks
    videoList.addEventListener('click', function (e) {
        if (e.target.tagName === 'A' || e.target.closest('a')) {
            e.preventDefault();
            const link = e.target.closest('a');
            const videoUrl = link.getAttribute('data-video-url');
            const title = link.getAttribute('data-title');
            const description = link.getAttribute('data-desc');
            
            updateVideo(videoUrl, title, description);
        }
    });
});
