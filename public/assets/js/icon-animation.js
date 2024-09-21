const icons = document.querySelectorAll('.chart-icon');
const container = document.querySelector('.chart-container');

const containerRect = container.getBoundingClientRect();
const containerWidth = containerRect.width;
const containerHeight = containerRect.height;
const containerRadius = Math.min(containerWidth, containerHeight) / 2;
const centerX = containerWidth / 2;
const centerY = containerHeight / 2;

const iconData = [];

// Initialize icon data
icons.forEach(icon => {
    const rect = icon.getBoundingClientRect();
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * (containerRadius - Math.max(rect.width, rect.height) / 2);
    iconData.push({
        element: icon,
        x: centerX + distance * Math.cos(angle),
        y: centerY + distance * Math.sin(angle),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        width: rect.width,
        height: rect.height,
        radius: Math.max(rect.width, rect.height) / 2
    });
});

function animate() {
    const len = iconData.length;
    for (let i = 0; i < len; i++) {
        const icon = iconData[i];
        
        // Update position
        icon.x += icon.vx;
        icon.y += icon.vy;

        // Check and handle circular boundary collision
        const dx = icon.x - centerX;
        const dy = icon.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = containerRadius - icon.radius;

        if (distance > maxDistance) {
            // Collision with circular boundary
            const angle = Math.atan2(dy, dx);
            const nx = Math.cos(angle);
            const ny = Math.sin(angle);

            // Reflect velocity
            const dotProduct = icon.vx * nx + icon.vy * ny;
            icon.vx -= 2 * dotProduct * nx;
            icon.vy -= 2 * dotProduct * ny;

            // Adjust position to be on the boundary
            icon.x = centerX + maxDistance * nx;
            icon.y = centerY + maxDistance * ny;
        }

        // Check collision with other icons
        for (let j = i + 1; j < len; j++) {
            const otherIcon = iconData[j];
            const dx = otherIcon.x - icon.x;
            const dy = otherIcon.y - icon.y;
            const distanceSquared = dx * dx + dy * dy;
            const minDistance = icon.radius + otherIcon.radius;
            const minDistanceSquared = minDistance * minDistance;

            if (distanceSquared < minDistanceSquared) {
                // Collision detected, reverse velocities
                const distance = Math.sqrt(distanceSquared);
                const nx = dx / distance;
                const ny = dy / distance;

                const p = 2 * (icon.vx * nx + icon.vy * ny - otherIcon.vx * nx - otherIcon.vy * ny) / (icon.radius + otherIcon.radius);

                icon.vx -= p * otherIcon.radius * nx;
                icon.vy -= p * otherIcon.radius * ny;
                otherIcon.vx += p * icon.radius * nx;
                otherIcon.vy += p * icon.radius * ny;

                // Move icons apart to prevent sticking
                const overlap = minDistance - distance;
                const moveX = overlap * nx / 2;
                const moveY = overlap * ny / 2;
                icon.x -= moveX;
                icon.y -= moveY;
                otherIcon.x += moveX;
                otherIcon.y += moveY;
            }
        }

        // Apply new position
        icon.element.style.transform = `translate(${icon.x - icon.radius}px, ${icon.y - icon.radius}px)`;
    }

    requestAnimationFrame(animate);
}

animate();