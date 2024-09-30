

const container = document.querySelector('.chart-container');
const icons = document.querySelectorAll('.chart-icon');

let containerRect, containerWidth, containerHeight, containerRadius, centerX, centerY;
let iconData = [];
let isInViewport = false;
let animationPaused = false;

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

function updateIconPositions() {
    iconData.forEach(icon => {
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
    });
}

function updateIconsDOM() {
    iconData.forEach(icon => {
        gsap.set(icon.element, {
            x: icon.x - icon.width / 2,
            y: icon.y - icon.height / 2
        });
    });
}

function animate() {
    if (!animationPaused) {
        updateIconPositions();
        updateIconsDOM();
    }
}

function startAnimation() {
    initializeContainer();
    initializeIcons();
    checkInViewport();
    
    if (isInViewport && !animationPaused) {
        gsap.ticker.add(animate);
    }
}

function pauseAnimation() {
    animationPaused = true;
    gsap.ticker.remove(animate);
}

function resumeAnimation() {
    animationPaused = false;
    gsap.ticker.add(animate);
}

function handleResize() {
    pauseAnimation();
    gsap.delayedCall(0.1, () => {
        startAnimation();
    });
}

function checkInViewport() {
    const rect = container.getBoundingClientRect();
    const wasInViewport = isInViewport;
    isInViewport = (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right > 0
    );

    if (isInViewport && !wasInViewport) {
        resumeAnimation();
    } else if (!isInViewport && wasInViewport) {
        pauseAnimation();
    }
}

function handleScroll() {
    gsap.delayedCall(0.1, checkInViewport);
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

// Use MutationObserver to detect when the container is added to the DOM
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            const addedNodes = mutation.addedNodes;
            for (let i = 0; i < addedNodes.length; i++) {
                if (addedNodes[i].matches && addedNodes[i].matches('.chart-container')) {
                    observer.disconnect();
                    initializeAnimation();
                    break;
                }
            }
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });

// Fallback initialization
document.addEventListener('DOMContentLoaded', initializeAnimation);
window.addEventListener('load', initializeAnimation);
setTimeout(initializeAnimation, 1000);