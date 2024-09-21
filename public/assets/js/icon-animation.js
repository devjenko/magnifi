const icons = document.querySelectorAll('.chart-icon');
const container = document.querySelector('.chart-container');

const containerRect = container.getBoundingClientRect();
const containerWidth = containerRect.width;
const containerHeight = containerRect.height;

const iconData = [];

// Initialize icon data
icons.forEach(icon => {
    const rect = icon.getBoundingClientRect();
    iconData.push({
        element: icon,
        x: Math.random() * (containerWidth - rect.width),
        y: Math.random() * (containerHeight - rect.height),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        width: rect.width,
        height: rect.height
    });
});

function animate() {
    iconData.forEach(icon => {
        // Update position
        icon.x += icon.vx;
        icon.y += icon.vy;

        // Bounce off walls
        if (icon.x < 0 || icon.x > containerWidth - icon.width) {
            icon.vx *= -1;
        }
        if (icon.y < 0 || icon.y > containerHeight - icon.height) {
            icon.vy *= -1;
        }

        // Check collision with other icons
        iconData.forEach(otherIcon => {
            if (icon !== otherIcon) {
                const dx = otherIcon.x - icon.x;
                const dy = otherIcon.y - icon.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = (icon.width + otherIcon.width) / 2;

                if (distance < minDistance) {
                    // Collision detected, reverse velocities
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);

                    // Rotate velocities
                    const vx1 = icon.vx * cos + icon.vy * sin;
                    const vy1 = icon.vy * cos - icon.vx * sin;
                    const vx2 = otherIcon.vx * cos + otherIcon.vy * sin;
                    const vy2 = otherIcon.vy * cos - otherIcon.vx * sin;

                    // Swap velocities
                    icon.vx = vx2 * cos - vy1 * sin;
                    icon.vy = vy2 * cos + vx1 * sin;
                    otherIcon.vx = vx1 * cos - vy2 * sin;
                    otherIcon.vy = vy1 * cos + vx2 * sin;

                    // Move icons apart to prevent sticking
                    const overlap = minDistance - distance;
                    icon.x -= overlap * cos / 2;
                    icon.y -= overlap * sin / 2;
                    otherIcon.x += overlap * cos / 2;
                    otherIcon.y += overlap * sin / 2;
                }
            }
        });

        // Apply new position
        icon.element.style.transform = `translate(${icon.x}px, ${icon.y}px)`;
    });

    requestAnimationFrame(animate);
}

animate();