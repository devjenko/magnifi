const container = document.querySelector('.chart-container');
const icons = document.querySelectorAll('.chart-icon');

let containerRect, containerWidth, containerHeight, containerRadius, centerX, centerY;
let iconData = [];
let animationFrameId;
let isInViewport = false;

function initializeContainer() {
    containerRect = container.getBoundingClientRect();
    containerWidth = containerRect.width;
    containerHeight = containerRect.height;
    containerRadius = Math.min(containerWidth, containerHeight) / 2;
    centerX = containerWidth / 2;
    centerY = containerHeight / 2;
}

function initializeIcons() {
    iconData = Array.from(icons).map(icon => {
        const rect = icon.getBoundingClientRect();
        return {
            element: icon,
            width: rect.width,
            height: rect.height,
            radius: Math.max(rect.width, rect.height) / 2
        };
    });
    
    resetIconPositions();
}

function resetIconPositions() {
    iconData.forEach(icon => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * (containerRadius - icon.radius);
        icon.x = centerX + distance * Math.cos(angle);
        icon.y = centerY + distance * Math.sin(angle);
        icon.vx = (Math.random() - 0.5) * 0.5;
        icon.vy = (Math.random() - 0.5) * 0.5;
        icon.element.style.transform = `translate(${icon.x - icon.width / 2}px, ${icon.y - icon.height / 2}px)`;
    });
}

function updateIconPosition(icon) {
    icon.x += icon.vx;
    icon.y += icon.vy;

    const dx = icon.x - centerX;
    const dy = icon.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = containerRadius - icon.radius;

    if (distance > maxDistance) {
        const angle = Math.atan2(dy, dx);
        icon.x = centerX + maxDistance * Math.cos(angle);
        icon.y = centerY + maxDistance * Math.sin(angle);
        icon.vx *= -0.8;
        icon.vy *= -0.8;
    }

    icon.element.style.transform = `translate(${icon.x - icon.width / 2}px, ${icon.y - icon.height / 2}px)`;
}

function animate() {
    if (!isInViewport) return;
    
    iconData.forEach(updateIconPosition);
    animationFrameId = requestAnimationFrame(animate);
}

function startAnimation() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    initializeContainer();
    initializeIcons();
    checkInViewport();
    if (isInViewport) {
        animate();
    }
}

function stopAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

function handleResize() {
    
    stopAnimation();
    
}

function checkInViewport() {
    const rect = container.getBoundingClientRect();
    isInViewport = (
        rect.top >= -rect.height &&
        rect.left >= -rect.width &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + rect.width
    );
    
    if (isInViewport && !animationFrameId) {
        animate();
    } else if (!isInViewport && animationFrameId) {
        stopAnimation();
    }
}

function initializeAnimation() {
    if (container && icons.length > 0) {
        startAnimation();
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', checkInViewport);
    } else {
        console.error('Container or icons not found. Ensure the DOM is loaded before running the script.');
    }
}

// Use both DOMContentLoaded and load events to ensure initialization
document.addEventListener('DOMContentLoaded', initializeAnimation);
window.addEventListener('load', initializeAnimation);

// Fallback initialization after a short delay
setTimeout(initializeAnimation, 1000);