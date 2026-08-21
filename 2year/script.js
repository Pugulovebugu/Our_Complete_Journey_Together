/* =========================
   ENTER WEBSITE
========================= */

const opening = document.getElementById("opening");
const enterBtn = document.getElementById("enterBtn");

let openingClosing = false;

enterBtn.addEventListener("click", () => {

    if (openingClosing) {
        return;
    }

    openingClosing = true;
    enterBtn.disabled = true;

    opening.classList.add("leaving");

    /* Let the cinematic exit finish before removing the overlay. */
    setTimeout(() => {

        opening.classList.add("hide");
        document.body.style.overflow = "auto";

    }, 900);

});


/* =========================
   RELATIONSHIP COUNTER
========================= */

const relationshipStart =
    new Date("2025-07-22T00:27:00+05:30");

function updateCounter() {

    const now = new Date();

    let difference = now - relationshipStart;

    if (difference < 0) {
        difference = 0;
    }

    const totalSeconds =
        Math.floor(difference / 1000);

    const days =
        Math.floor(totalSeconds / 86400);

    const hours =
        Math.floor((totalSeconds % 86400) / 3600);

    const minutes =
        Math.floor((totalSeconds % 3600) / 60);

    const seconds =
        totalSeconds % 60;


    document.getElementById("days").textContent =
        days.toLocaleString();

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}

updateCounter();

setInterval(updateCounter, 1000);


/* =========================
   FLOATING HEARTS
========================= */

const heartsContainer =
    document.getElementById("hearts");

const heartSymbols = ["♡", "♥", "❤", "✦"];

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isLowPowerDevice =
    navigator.hardwareConcurrency &&
    navigator.hardwareConcurrency <= 4;

function createHeart() {

    const heart =
        document.createElement("span");

    heart.className = "floating-heart";

    heart.textContent =
        heartSymbols[
            Math.floor(
                Math.random() * heartSymbols.length
            )
        ];

    heart.style.left =
        Math.random() * 100 + "%";

    heart.style.fontSize =
        10 + Math.random() * 18 + "px";

    heart.style.animationDuration =
        8 + Math.random() * 10 + "s";

    heart.style.animationDelay =
        Math.random() * 2 + "s";

    // Keep the particle count bounded for smoother scrolling on phones.
    const maxHearts =
        window.matchMedia("(max-width: 700px)").matches ? 8 : 14;

    while (heartsContainer.children.length > maxHearts) {
        heartsContainer.firstElementChild.remove();
    }

    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 20000);
}

let heartInterval = null;

function startHeartAnimation() {
    if (heartInterval || document.hidden) return;
    heartInterval = setInterval(createHeart,
        window.matchMedia("(max-width: 700px)").matches ? 2200 : 1500
    );
}

function stopHeartAnimation() {
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
}

startHeartAnimation();

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopHeartAnimation();
    } else {
        startHeartAnimation();
    }
});


/* =========================
   INITIAL STATE
========================= */

document.body.style.overflow = "hidden";

/* =========================
   JOURNEY SCROLL ANIMATION
========================= */

const timelineItems =
    document.querySelectorAll(".timeline-item");

const timelineObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    timelineObserver.unobserve(
                        entry.target
                    );
                }

            });

        },
        {
            threshold: 0.15
        }
    );


timelineItems.forEach((item) => {
    timelineObserver.observe(item);
});

/* =========================
   REASON CARD FLIP
========================= */

const reasonCards =
    document.querySelectorAll(".reason-card");

reasonCards.forEach((card) => {

    const inner = card.querySelector(".reason-inner");
    const tapText = card.querySelector(".tap-text");

    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-expanded", "false");
    card.setAttribute("aria-label", "Reveal this little thing");

    const toggleReasonCard = () => {
        const active = card.classList.toggle("active");
        card.setAttribute("aria-expanded", String(active));
    };

    card.addEventListener("click", toggleReasonCard);

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleReasonCard();
        }
    });

    if (tapText) {
        tapText.setAttribute("role", "button");
        tapText.setAttribute("tabindex", "0");
        tapText.setAttribute("aria-label", "Tap to reveal");

        tapText.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleReasonCard();
        });

        tapText.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                toggleReasonCard();
            }
        });
    }

    // Keep inline tilt transforms from interfering with an active flip.
    card.addEventListener("transitionend", () => {
        if (!card.classList.contains("active") && inner) {
            inner.style.transform = "";
        }
    });
});


/* =========================
   3D TILT EFFECT
========================= */

reasonCards.forEach((card) => {

    if (window.matchMedia("(pointer: coarse)").matches || prefersReducedMotion) {
        return;
    }

    card.addEventListener("mousemove", (event) => {

        if (card.classList.contains("active")) {
            return;
        }

        const rect =
            card.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        const centerX =
            rect.width / 2;

        const centerY =
            rect.height / 2;

        const rotateX =
            ((y - centerY) / centerY) * -4;

        const rotateY =
            ((x - centerX) / centerX) * 4;

        card.querySelector(".reason-inner").style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });


    card.addEventListener("mouseleave", () => {

        if (!card.classList.contains("active")) {

            card.querySelector(
                ".reason-inner"
            ).style.transform = "";

        }

    });

});
/* =========================
   MEMORY VIEWER
========================= */

const memoryCards =
    document.querySelectorAll(".memory-card");

// Gracefully handle missing thumbnail files too.
memoryCards.forEach(card => {

    const image =
        card.querySelector(".memory-image img");

    if (!image) return;

    image.addEventListener("error", () => {

        image.classList.add("memory-image-missing");

        image.src =
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700">
                    <defs>
                        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#241019"/>
                            <stop offset="100%" stop-color="#6b2742"/>
                        </linearGradient>
                    </defs>
                    <rect width="900" height="700" fill="url(#bg)"/>
                    <text x="450" y="335" text-anchor="middle" fill="#f2c6d3" font-family="Georgia,serif" font-size="42">Memory ♡</text>
                    <text x="450" y="390" text-anchor="middle" fill="#ffffff" opacity=".55" font-family="Arial,sans-serif" font-size="20">Photo unavailable</text>
                </svg>
            `);

    });
});

const memoryViewer =
    document.getElementById("memoryViewer");

const viewerImage =
    document.getElementById("viewerImage");

const viewerTitle =
    document.getElementById("viewerTitle");

const viewerDate =
    document.getElementById("viewerDate");

const viewerDescription =
    document.getElementById("viewerDescription");

const viewerNumber =
    document.getElementById("viewerNumber");

const viewerClose =
    document.getElementById("viewerClose");

const viewerPrev =
    document.getElementById("viewerPrev");

const viewerNext =
    document.getElementById("viewerNext");


let currentMemory = 0;


/* =========================
   MEMORY DATA
========================= */

const memories =
    Array.from(memoryCards).map(card => ({
        image: card.dataset.image,
        title: card.dataset.title,
        date: card.dataset.date,
        description: card.dataset.description
    }));


/* =========================
   OPEN MEMORY
========================= */

function openMemory(index) {

    currentMemory = index;

    const memory =
        memories[currentMemory];

    // Reset any previous missing-image state.
    viewerImage.classList.remove(
        "memory-image-missing",
        "viewer-image-changing"
    );

    // Restart the image transition every time the memory changes.
    void viewerImage.offsetWidth;
    viewerImage.classList.add("viewer-image-changing");

    viewerImage.src =
        memory.image;

    viewerImage.alt =
        memory.title;

    // If a memory file is missing, show a graceful placeholder
    // instead of the browser's broken-image icon.
    viewerImage.onerror = () => {

        viewerImage.classList.add("memory-image-missing");

        viewerImage.src =
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
                    <defs>
                        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#241019"/>
                            <stop offset="100%" stop-color="#6b2742"/>
                        </linearGradient>
                    </defs>
                    <rect width="900" height="1200" fill="url(#bg)"/>
                    <text x="450" y="555" text-anchor="middle" fill="#f2c6d3" font-family="Georgia,serif" font-size="46">Memory</text>
                    <text x="450" y="620" text-anchor="middle" fill="#ffffff" opacity=".55" font-family="Arial,sans-serif" font-size="22">Photo unavailable</text>
                    <text x="450" y="700" text-anchor="middle" fill="#d8a3b5" font-family="Georgia,serif" font-size="36">♡</text>
                </svg>
            `);

    };

    viewerTitle.textContent =
        memory.title;

    viewerDate.textContent =
        memory.date;

    viewerDescription.textContent =
        memory.description;

    viewerNumber.textContent =
        String(currentMemory + 1)
            .padStart(2, "0");


    memoryViewer.classList.add("active");

    document.body.style.overflow = "hidden";
}


/* =========================
   CLOSE
========================= */

function closeMemory() {

    memoryViewer.classList.remove("active");

    document.body.style.overflow = "auto";
}


/* =========================
   NEXT
========================= */

function nextMemory() {

    currentMemory =
        (currentMemory + 1) %
        memories.length;

    openMemory(currentMemory);
}


/* =========================
   PREVIOUS
========================= */

function previousMemory() {

    currentMemory =
        (currentMemory - 1 + memories.length) %
        memories.length;

    openMemory(currentMemory);
}


/* =========================
   CARD CLICK
========================= */

memoryCards.forEach(card => {

    card.addEventListener("click", () => {

        const index =
            Number(card.dataset.index);

        openMemory(index);

    });

});


/* =========================
   BUTTONS
========================= */

viewerClose.addEventListener(
    "click",
    closeMemory
);

viewerNext.addEventListener(
    "click",
    nextMemory
);

viewerPrev.addEventListener(
    "click",
    previousMemory
);


/* =========================
   CLICK BACKDROP TO CLOSE
========================= */

memoryViewer.addEventListener(
    "click",
    (event) => {

        if (
            event.target === memoryViewer
        ) {
            closeMemory();
        }

    }
);


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            !memoryViewer.classList.contains(
                "active"
            )
        ) {
            return;
        }

        if (event.key === "Escape") {
            closeMemory();
        }

        if (event.key === "ArrowRight") {
            nextMemory();
        }

        if (event.key === "ArrowLeft") {
            previousMemory();
        }

    }
);


/* =========================
   MOBILE SWIPE
========================= */

let touchStartX = 0;
let touchEndX = 0;


memoryViewer.addEventListener(
    "touchstart",
    (event) => {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    { passive: true }
);


memoryViewer.addEventListener(
    "touchend",
    (event) => {

        touchEndX =
            event.changedTouches[0].screenX;

        const difference =
            touchEndX - touchStartX;


        if (Math.abs(difference) < 50) {
            return;
        }


        if (difference < 0) {
            nextMemory();
        } else {
            previousMemory();
        }

    },
    { passive: true }
);
/* =========================
   DISTANCE SECTION STARS
========================= */

const starsContainer =
    document.getElementById("stars");

function createStars() {

    if (!starsContainer) return;

    const starCount =
        prefersReducedMotion
            ? 0
            : window.innerWidth < 600
                ? 35
                : isLowPowerDevice
                    ? 70
                    : 120;


    for (let i = 0; i < starCount; i++) {

        const star =
            document.createElement("span");

        star.className = "star";

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 100 + "%";

        const size =
            1 + Math.random() * 2;

        star.style.width =
            size + "px";

        star.style.height =
            size + "px";

        star.style.animationDelay =
            Math.random() * 3 + "s";

        star.style.animationDuration =
            1.5 + Math.random() * 3 + "s";

        starsContainer.appendChild(star);
    }
}

createStars();
/* =========================
   LOVE LETTER
========================= */

const envelopeContainer =
    document.getElementById(
        "envelopeContainer"
    );

const openLetterBtn =
    document.getElementById(
        "openLetterBtn"
    );

const letterText =
    document.getElementById(
        "letterText"
    );

const letterAfter =
    document.getElementById(
        "letterAfter"
    );


/* =========================
   LETTER CONTENT
========================= */

const letterMessage = `
Dear Bugu,

13 months.

It sounds like just a number,
but for me it carries hundreds of
conversations, countless smiles,
late nights, little fights, silly
moments, apologies, laughter and
so many memories that I never want
to forget.

When I look back at where we started,
I still can't believe that one simple
meeting could lead me here.

You became someone incredibly special
to me.

Someone I look forward to talking to.
Someone I miss when you're not around.
Someone whose happiness genuinely
matters to me.

I know distance hasn't always been easy.

There are moments when I wish I could
just be beside you instead of being
behind a screen.

But even with all those kilometres
between us, you have never felt far
from my heart.

Thank you for staying.
Thank you for understanding me.
Thank you for being you.

And if I could go back to the very
beginning and choose again...

I would still choose you.

Happy 1 Year & 1 Month, my Bugu.

I love you. ❤️
`;


/* =========================
   TYPEWRITER
========================= */

let typingStarted = false;

function typeLetter() {

    if (typingStarted) {
        return;
    }

    typingStarted = true;

    letterText.textContent = "";

    let index = 0;

    function type() {

        if (index < letterMessage.length) {

            letterText.textContent +=
                letterMessage.charAt(index);

            index++;

            setTimeout(
                type,
                22
            );

        } else {

            /* Reveal the signature only after the final
               character of the letter has been typed. */
            setTimeout(() => {

                const signature =
                    document.querySelector(
                        ".letter-signature"
                    );

                if (signature) {
                    signature.classList.add(
                        "visible"
                    );
                }

                setTimeout(() => {

                    letterAfter.classList.add(
                        "visible"
                    );

                }, 900);

            }, 350);

        }

    }

    type();
}


/* =========================
   OPEN LETTER
========================= */

openLetterBtn.addEventListener(
    "click",
    () => {

        envelopeContainer.classList.add(
            "opened"
        );

        setTimeout(() => {

            typeLetter();

        }, 1200);

    }
);
/* =========================
   13 PROMISES
========================= */

const promiseCards =
    document.querySelectorAll(".promise-card");

const promiseCount =
    document.getElementById("promiseCount");

const promiseProgress =
    document.getElementById("promiseProgress");


let unlockedPromises = 0;


/* =========================
   UNLOCK PROMISE
========================= */

promiseCards.forEach((card, index) => {

    const button =
        card.querySelector(".unlock-promise");


    button.addEventListener("click", (event) => {

        event.stopPropagation();


        if (
            card.classList.contains("unlocked")
        ) {
            return;
        }


        card.classList.add("unlocked");

        unlockedPromises++;


        promiseCount.textContent =
            unlockedPromises;


        const percentage =
            (unlockedPromises / promiseCards.length) * 100;


        promiseProgress.style.width =
            percentage + "%";


        createPromiseHearts(
            event.clientX,
            event.clientY
        );


        /* Final card unlocked */

        if (
    unlockedPromises ===
    promiseCards.length
) {

    setTimeout(() => {

        const foreverContainer =
            document.getElementById(
                "foreverContainer"
            );

        foreverContainer.classList.add(
            "ready"
        );

        setTimeout(() => {

            foreverContainer.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }, 700);

    }, 900);

}

    });

});


/* =========================
   LITTLE HEART EFFECT
========================= */

function createPromiseHearts(
    x,
    y
) {

    for (let i = 0; i < 6; i++) {

        const heart =
            document.createElement("span");

        heart.textContent = "♡";

        heart.style.position =
            "fixed";

        heart.style.left =
            x + "px";

        heart.style.top =
            y + "px";

        heart.style.zIndex =
            "999";

        heart.style.pointerEvents =
            "none";

        heart.style.color =
            "rgba(242,198,211,0.9)";

        heart.style.fontSize =
            12 + Math.random() * 10 + "px";

        document.body.appendChild(
            heart
        );


        const destinationX =
            (Math.random() - 0.5) * 140;

        const destinationY =
            -50 - Math.random() * 100;


        heart.animate(
            [
                {
                    transform:
                        "translate(-50%, -50%) scale(1)",
                    opacity: 1
                },

                {
                    transform:
                        `translate(
                            calc(-50% + ${destinationX}px),
                            calc(-50% + ${destinationY}px)
                        )
                        scale(0.4)`,
                    opacity: 0
                }
            ],
            {
                duration:
                    900 + Math.random() * 500,

                easing:
                    "cubic-bezier(.2,.8,.2,1)"
            }
        ).onfinish = () => {
            heart.remove();
        };

    }

}


/* =========================
   FOREVER
========================= */

const foreverYes =
    document.getElementById(
        "foreverYes"
    );

const foreverAgain =
    document.getElementById(
        "foreverAgain"
    );

const foreverAnswer =
    document.getElementById(
        "foreverAnswer"
    );


foreverYes.addEventListener(
    "click",
    () => {

        foreverAnswer.textContent =
            "Forever. And then a little longer. ❤️";

        createForeverExplosion();

    }
);


foreverAgain.addEventListener(
    "click",
    () => {

        foreverAnswer.textContent =
            "Again. Again. And again. ♾️❤️";

        createForeverExplosion();

    }
);


/* =========================
   FOREVER HEART EXPLOSION
========================= */

function createForeverExplosion() {

    const container =
        document.getElementById(
            "foreverContainer"
        );

    const rect =
        container.getBoundingClientRect();

    const centerX =
        rect.left + rect.width / 2;

    const centerY =
        rect.top + 110;


    for (let i = 0; i < 25; i++) {

        const heart =
            document.createElement("span");

        heart.textContent =
            Math.random() > 0.5
                ? "♥"
                : "♡";

        heart.style.position =
            "fixed";

        heart.style.left =
            centerX + "px";

        heart.style.top =
            centerY + "px";

        heart.style.zIndex =
            "999";

        heart.style.pointerEvents =
            "none";

        heart.style.color =
            "rgba(242,198,211,0.9)";

        heart.style.fontSize =
            10 + Math.random() * 18 + "px";

        document.body.appendChild(
            heart
        );


        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            80 + Math.random() * 180;


        const x =
            Math.cos(angle) * distance;

        const y =
            Math.sin(angle) * distance;


        heart.animate(
            [
                {
                    transform:
                        "translate(-50%, -50%) scale(0)",
                    opacity: 0
                },

                {
                    transform:
                        "translate(-50%, -50%) scale(1)",
                    opacity: 1
                },

                {
                    transform:
                        `translate(
                            calc(-50% + ${x}px),
                            calc(-50% + ${y}px)
                        )
                        scale(0.2)`,
                    opacity: 0
                }
            ],
            {
                duration:
                    1200 + Math.random() * 800,

                easing:
                    "cubic-bezier(.2,.8,.2,1)"
            }
        ).onfinish = () => {
            heart.remove();
        };

    }

}



/* =========================
   OPEN WHEN LETTERS
========================= */
(function () {
    const section = document.getElementById("openWhen");
    if (!section) return;

    const modal = document.getElementById("whenLetter");
    const close = document.getElementById("whenClose");
    const label = document.getElementById("whenLetterLabel");
    const title = document.getElementById("whenLetterTitle");
    const text = document.getElementById("whenLetterText");
    const cards = section.querySelectorAll(".when-card");

    const letters = {
        miss: {
            label: "OPEN WHEN YOU MISS ME",
            title: "Come a little closer. ♡",
            text: "I know there are days when I wish I could simply appear beside you. Until that day comes, remember that distance has never changed how important you are to me. You are still the person I want to tell things to, laugh with and come back to."
        },
        sad: {
            label: "OPEN WHEN YOU'RE HAVING A BAD DAY",
            title: "You don't have to be okay all the time.",
            text: "Take a breath, Bugu. You don't have to fix everything today. Be gentle with yourself. And if I could be there, I'd probably sit beside you quietly first and make you smile later."
        },
        sleep: {
            label: "OPEN WHEN YOU CAN'T SLEEP",
            title: "It's another little late night. ☾",
            text: "Put your phone down for a moment, close your eyes and imagine that the distance isn't there. Somewhere, in the version of our story I'm always dreaming about, I'm right beside you saying goodnight."
        },
        angry: {
            label: "OPEN WHEN YOU'RE ANGRY AT ME",
            title: "Even when we're not okay...",
            text: "I would rather understand you than win an argument. So take your time. Tell me what hurt you. And when you're ready, remember that one difficult moment will never be bigger than everything we've built together."
        },
        hug: {
            label: "OPEN WHEN YOU NEED A HUG",
            title: "Here. One from me. 🫂",
            text: "I wish hugs could travel through screens. Since they can't yet, imagine this one lasting a little longer than normal. No words. Just me holding you and reminding you that you are loved."
        },
        happy: {
            label: "OPEN WHEN YOU'RE HAPPY",
            title: "Tell me everything. ✦",
            text: "Your happy moments matter to me too. I want to hear the tiny details, the big news and all the silly excitement. If something made you smile today, I hope you know that somewhere, it made me smile too."
        }
    };

    function openWhen(key) {
        const letter = letters[key];
        if (!letter) return;

        label.textContent = letter.label;
        title.textContent = letter.title;
        text.textContent = letter.text;
        modal.classList.add("visible");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeWhen() {
        modal.classList.remove("visible");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto";
    }

    cards.forEach(card => {
        card.addEventListener("click", () => {
            openWhen(card.dataset.when);
        });
    });

    close?.addEventListener("click", closeWhen);

    modal?.addEventListener("click", event => {
        if (event.target === modal) closeWhen();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modal.classList.contains("visible")) {
            closeWhen();
        }
    });
})();

/* =========================
   OUR NEXT CHAPTER
========================= */

(function () {
    const section = document.getElementById("nextChapter");
    if (!section) return;

    const steps = section.querySelectorAll(".chapter-step");
    const dots = section.querySelectorAll(".chapter-dot");
    const start = document.getElementById("chapterStart");
    const question = document.getElementById("chapterQuestion");
    const reveal = document.getElementById("chapterReveal");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let currentStep = 0;
    let finalBurstPlayed = false;

    function showStep(index) {
        if (index < 0 || index >= steps.length) return;
        steps.forEach((step, i) => step.classList.toggle("active", i === index));
        dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
        currentStep = index;
    }

    function nextStep() {
        if (currentStep < steps.length - 1) showStep(currentStep + 1);
    }

    start?.addEventListener("click", nextStep);
    question?.addEventListener("click", nextStep);

    reveal?.addEventListener("click", () => {
        nextStep();
        if (reduceMotion || finalBurstPlayed) return;
        finalBurstPlayed = true;

        setTimeout(() => {
            for (let i = 0; i < 14; i++) {
                const heart = document.createElement("span");
                heart.textContent = Math.random() > .5 ? "♡" : "♥";
                heart.style.position = "fixed";
                heart.style.left = "50%";
                heart.style.top = "50%";
                heart.style.zIndex = "9999";
                heart.style.pointerEvents = "none";
                heart.style.color = "rgba(242,198,211,.8)";
                heart.style.fontSize = `${12 + Math.random() * 14}px`;
                document.body.appendChild(heart);

                const angle = Math.random() * Math.PI * 2;
                const distance = 90 + Math.random() * 190;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                heart.animate([
                    { transform: "translate(-50%, -50%) scale(0)", opacity: 0 },
                    { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
                    { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(.2)`, opacity: 0 }
                ], {
                    duration: 1100 + Math.random() * 500,
                    easing: "cubic-bezier(.2,.8,.2,1)"
                }).onfinish = () => heart.remove();
            }
        }, 250);
    });

    showStep(0);
})();


/* =========================
   PHASE 2 — MEMORY VIEWER DOTS
========================= */

(function () {
    const dotsContainer = document.getElementById("viewerDots");
    const progressBar = document.getElementById("viewerProgressBar");

    if (!dotsContainer || !progressBar || !memories.length) return;

    memories.forEach((memory, index) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "viewer-dot";
        dot.setAttribute("aria-label", `Open memory ${index + 1}`);
        dot.addEventListener("click", () => openMemory(index));
        dotsContainer.appendChild(dot);
    });

    function updateViewerProgress() {
        const dots = dotsContainer.querySelectorAll(".viewer-dot");
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentMemory);
        });
        progressBar.style.width = `${((currentMemory + 1) / memories.length) * 100}%`;
    }

    const originalOpenMemory = openMemory;
    openMemory = function (index) {
        originalOpenMemory(index);
        updateViewerProgress();
    };

    updateViewerProgress();
})();


/* =========================
   SOMEDAY, WITH YOU
========================= */
(function(){const section=document.getElementById("someday");if(!section)return;const cards=[...section.querySelectorAll(".someday-card")],count=document.getElementById("somedayCount"),progress=document.getElementById("somedayProgress"),message=document.getElementById("somedayMessage"),footer=document.getElementById("somedayFooterText"),key="puguBuguSomedayList",messages=["One little someday at a time.","A few wishes are already glowing.","We're collecting moments before they happen.","The list is starting to look like us.","Halfway to a future full of little memories.","So many little adventures waiting for us.","Almost there. Keep the last one for someday.","Maybe the best memories are still unwritten."];let completed=[];try{const saved=JSON.parse(localStorage.getItem(key)||"[]");if(Array.isArray(saved))completed=saved.filter(i=>Number.isInteger(i)&&i>=0&&i<cards.length)}catch(e){}function update(){cards.forEach((card,i)=>{const done=completed.includes(i);card.classList.toggle("is-done",done);card.setAttribute("aria-pressed",String(done));const check=card.querySelector(".someday-check");if(check)check.textContent=done?"♥":"♡"});const total=cards.length,n=completed.length;if(count)count.textContent=`${n} / ${total}`;if(progress)progress.style.width=`${total?n/total*100:0}%`;if(message)message.textContent=n===0?"We have a whole little future to fill.":n===total?"Okay... now let's go make them real. ♡":messages[Math.min(n-1,messages.length-1)];if(footer)footer.textContent=n===total?"Now the list is full. The real story starts outside this screen. ♡":"Someday isn't a deadline. It's a direction.";try{localStorage.setItem(key,JSON.stringify(completed))}catch(e){}}cards.forEach((card,i)=>card.addEventListener("click",()=>{completed=completed.includes(i)?completed.filter(x=>x!==i):[...completed,i];completed.sort((a,b)=>a-b);update()}));update()})();


/* =====================================================
   PHASE 4 — PRESENCE MOMENT
===================================================== */
(function () {
    const reveal = document.getElementById("presenceReveal");
    const message = document.getElementById("presenceMessage");
    const section = document.getElementById("presence");

    if (!reveal || !message || !section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    reveal.addEventListener("click", () => {
        const isOpen = reveal.getAttribute("aria-expanded") === "true";
        const nextState = !isOpen;

        reveal.setAttribute("aria-expanded", String(nextState));
        message.classList.toggle("visible", nextState);
        message.setAttribute("aria-hidden", String(!nextState));

        if (nextState && !reduceMotion) {
            const rect = reveal.getBoundingClientRect();
            for (let i = 0; i < 10; i++) {
                const heart = document.createElement("span");
                heart.textContent = Math.random() > 0.5 ? "♡" : "✦";
                heart.style.position = "fixed";
                heart.style.left = `${rect.left + rect.width / 2}px`;
                heart.style.top = `${rect.top + rect.height / 2}px`;
                heart.style.zIndex = "9999";
                heart.style.pointerEvents = "none";
                heart.style.color = "rgba(242,198,211,.72)";
                heart.style.fontSize = `${10 + Math.random() * 12}px`;

                document.body.appendChild(heart);

                const angle = Math.random() * Math.PI * 2;
                const distance = 45 + Math.random() * 90;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                heart.animate([
                    { transform: "translate(-50%, -50%) scale(.4)", opacity: 0 },
                    { transform: "translate(-50%, -50%) scale(1)", opacity: 1, offset: .25 },
                    { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(.2)`, opacity: 0 }
                ], {
                    duration: 900 + Math.random() * 450,
                    easing: "cubic-bezier(.2,.8,.2,1)"
                }).onfinish = () => heart.remove();
            }
        }
    });
})();

/* Bottom month navigation */
(()=>{const p=document.getElementById('previousMonthBtn'),b=document.getElementById('backBtn');if(p)p.addEventListener('click',()=>{const m=location.pathname.match(/(?:month[-_]?)(\d+)(?:\.html)?$/i)||location.pathname.match(/(?:^|\/)(\d+)[-_]?month(?:\.html)?$/i);if(m&&+m[1]>1){location.href=`month-${+m[1]-1}.html`;return}if(history.length>1)history.back()});if(b)b.addEventListener('click',()=>history.length>1?history.back():location.href='index.html')})();
