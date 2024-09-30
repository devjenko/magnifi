const container = document.querySelector('.chart-container');
const icons = document.querySelectorAll('.chart-icon');

let containerRect, containerWidth, containerHeight, containerRadius, centerX, centerY;
let iconData = [];
let animationFrameId;
let isInViewport = false;
let lastScrollTime = 0;
let lastResizeTime = 0;

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
            radius: Math.max(rect.width, rect.height) / 2,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0
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
    });
    updateIconsDOM();
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
}

function updateIconsDOM() {
    iconData.forEach(icon => {
        icon.element.style.transform = `translate(${icon.x - icon.width / 2}px, ${icon.y - icon.height / 2}px)`;
    });
}

function animate() {
    if (!isInViewport) {
        animationFrameId = requestAnimationFrame(animate);
        return;
    }
    
    iconData.forEach(updateIconPosition);
    updateIconsDOM();
    animationFrameId = requestAnimationFrame(animate);
}

function startAnimation() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    initializeContainer();
    initializeIcons();
    checkInViewport();
    animate();
}

function handleResize() {
    const now = Date.now();
    if (now - lastResizeTime < 100) return;
    lastResizeTime = now;
    
    startAnimation();
}

function checkInViewport() {
    const rect = container.getBoundingClientRect();
    isInViewport = (
        rect.top >= -rect.height &&
        rect.left >= -rect.width &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + rect.width
    );
}

function handleScroll() {
    const now = Date.now();
    if (now - lastScrollTime < 100) return;
    lastScrollTime = now;
    
    checkInViewport();
}

function initializeAnimation() {
    if (container && icons.length > 0) {
        startAnimation();
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
    } else {
        console.error('Container or icons not found. Ensure the DOM is loaded before running the script.');
    }
}

document.addEventListener('DOMContentLoaded', initializeAnimation);
window.addEventListener('load', initializeAnimation);
setTimeout(initializeAnimation, 1000);