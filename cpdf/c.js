let currentTopicIndex = 0;

const topics = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5', 'topic6', 'topic7', 'topic8', 'topic9', 'topic10'];

function showContent(topicId) {
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(content => {
        content.style.display = 'none';
    });

    // Show the selected content section
    const contentSection = document.getElementById(topicId);
    contentSection.style.display = 'block';

    // Highlight the active topic in the sidebar
    const activeTopic = document.querySelector(`.sidebarjs ul li[data-topic="${topicId}"]`);
    document.querySelectorAll('.sidebarjs ul li').forEach(li => {
        li.classList.remove('active');
    });
    activeTopic.classList.add('active');

    // Scroll the content area to the top
    contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Scroll the sidebar to ensure the active topic is visible
    activeTopic.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Update the current topic index
    currentTopicIndex = topics.indexOf(topicId);
}

function previousContent() {
    if (currentTopicIndex > 0) {
        currentTopicIndex--;
        showContent(topics[currentTopicIndex]);
    }
}

function nextContent() {
    if (currentTopicIndex < topics.length - 1) {
        currentTopicIndex++;
        showContent(topics[currentTopicIndex]);
    }
}

// Initialize the first topic
window.onload = function() {
    showContent(topics[currentTopicIndex]);

    // Set up click events for sidebar topics
    document.querySelectorAll('.sidebarjs ul li').forEach(li => {
        li.addEventListener('click', function() {
            const topicId = this.getAttribute('data-topic');
            currentTopicIndex = topics.indexOf(topicId);
            showContent(topicId);
        });
    });
};
