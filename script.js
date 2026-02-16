let students = [];
let usedIndexes = [];
let correct = 0;
let wrong = 0;
let timer = 120;
let interval;
let mode = "";
let playerName = "";
let dataLoaded = false;

// =======================
// LOAD JSON
// =======================
fetch("BlueArchive_Students_FULL_REAL.json")
    .then(res => res.json())
    .then(data => {
        students = data;
        dataLoaded = true;
        console.log("Data Loaded:", students.length);
    })
    .catch(err => {
        alert("Gagal load data JSON!");
        console.error(err);
    });

// =======================
// START GAME
// =======================
function startGame(selectedMode) {

    if (!dataLoaded) {
        alert("Data masih loading...");
        return;
    }

    playerName = document.getElementById("playerName").value.trim();
    if (playerName === "") return alert("Masukkan nama dulu!");

    mode = selectedMode;

    correct = 0;
    wrong = 0;
    timer = 120;
    usedIndexes = [];
    clearInterval(interval);

    document.getElementById("correct").textContent = 0;
    document.getElementById("wrong").textContent = 0;
    document.getElementById("timer").textContent = timer;

    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("resultScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");

    startTimer();
    nextQuestion();
}

// =======================
// TIMER
// =======================
function startTimer() {
    interval = setInterval(() => {
        timer--;
        document.getElementById("timer").textContent = timer;

        if (timer <= 0) {
            clearInterval(interval);
            endGame();
        }
    }, 1000);
}

// =======================
// RANDOM STUDENT
// =======================
function getRandomStudent() {

    if (usedIndexes.length >= students.length) {
        endGame();
        return null;
    }

    let index;
    let safety = 0;

    do {
        index = Math.floor(Math.random() * students.length);
        safety++;
    } while (usedIndexes.includes(index) && safety < 50);

    usedIndexes.push(index);
    return students[index];
}

// =======================
// NEXT QUESTION
// =======================
function nextQuestion() {

    let student;
    let questionText = "";
    let correctAnswer = "";
    let options = [];
    let safety = 0;

    while (safety < 30) {

        student = getRandomStudent();
        if (!student) return;

        let type = mode === "casual"
            ? Math.floor(Math.random() * 5)
            : Math.floor(Math.random() * 11);

        if (mode === "casual") {

            if (type === 0 && student.sekolah) {
                questionText = `Siapakah murid dari sekolah ${student.sekolah}?`;
                correctAnswer = student.nama;
                options = students.map(s => s.nama);
            }

            else if (type === 1 && student.sekolah) {
                questionText = `${student.nama} berasal dari sekolah apa?`;
                correctAnswer = student.sekolah;
                options = [...new Set(students.map(s => s.sekolah).filter(Boolean))];
            }

            else if (type === 2 && student.klub) {
                questionText = `${student.nama} tergabung dalam klub apa?`;
                correctAnswer = student.klub;
                options = [...new Set(students.map(s => s.klub).filter(Boolean))];
            }

            else if (type === 3 && student.attack) {
                questionText = `Apa tipe Attack ${student.nama}?`;
                correctAnswer = student.attack;
                options = [...new Set(students.map(s => s.attack).filter(Boolean))];
            }

            else if (type === 4 && student.armor) {
                questionText = `Apa tipe Armor dari ${student.nama}?`;
                correctAnswer = student.armor;
                options = [...new Set(students.map(s => s.armor).filter(Boolean))];
            }
        }

        else {

            const skillMap = {
                0: "ex_skill",
                1: "attack",
                2: "armor",
                3: "klub",
                4: "basic_skill",
                5: "passive_skill",
                6: "sub_skill"
            };

            const reverseMap = {
                7: "ex_skill",
                8: "basic_skill",
                9: "passive_skill",
                10: "sub_skill"
            };

            if (type <= 6 && student[skillMap[type]]) {
                let key = skillMap[type];
                questionText = `Apa ${key.replace("_", " ").toUpperCase()} dari ${student.nama}?`;
                correctAnswer = student[key];
                options = [...new Set(students.map(s => s[key]).filter(Boolean))];
            }

            else if (type >= 7 && student[reverseMap[type]]) {
                let key = reverseMap[type];
                questionText = `Siapa pemilik ${key.replace("_", " ").toUpperCase()} berikut?\n"${student[key]}"`;
                correctAnswer = student.nama;
                options = students.map(s => s.nama);
            }
        }

        if (questionText && correctAnswer && options.length >= 4) break;

        safety++;
    }

    if (!questionText) {
        nextQuestion();
        return;
    }

    options = options.filter(opt => opt !== correctAnswer);
    options.sort(() => Math.random() - 0.5);
    options = options.slice(0, 3);
    options.push(correctAnswer);
    options.sort(() => Math.random() - 0.5);

    document.getElementById("question").textContent = questionText;

    let answersDiv = document.getElementById("answers");
    answersDiv.innerHTML = "";

    options.forEach(option => {
        let btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = option;

        btn.onclick = () => {

            if (option === correctAnswer) {
                correct++;
                document.getElementById("correct").textContent = correct;
            } else {
                wrong++;
                document.getElementById("wrong").textContent = wrong;
            }

            nextQuestion();
        };

        answersDiv.appendChild(btn);
    });
}

// =======================
// END GAME
// =======================
function endGame() {

    clearInterval(interval);

    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("resultScreen").classList.remove("hidden");

    let gradeText = "";

    if (correct >= 20) gradeText = "🔥 INIMAH RAJA MALDING 🔥";
    else if (correct >= 15) gradeText = "💎 GG Sensei";
    else if (correct >= 10) gradeText = "✨ NICE TRY";
    else gradeText = "🫠 Butuh Farming Lagi";

    document.getElementById("resultText").innerHTML =
        `<p>Nama: <b>${playerName}</b></p>
         <p>Mode: <b>${mode.toUpperCase()}</b></p>
         <p>Benar: <b>${correct}</b></p>
         <p>Salah: <b>${wrong}</b></p>`;

    document.getElementById("grade").textContent = gradeText;

    saveScore();
    loadLeaderboard();
}

// =======================
// SAVE SCORE
// =======================
function saveScore() {

    let leaderboard = JSON.parse(localStorage.getItem("ba_leaderboard")) || [];

    leaderboard.push({
        name: playerName,
        mode: mode.toUpperCase(),
        score: correct
    });

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);

    localStorage.setItem("ba_leaderboard", JSON.stringify(leaderboard));
}

// =======================
// LOAD LEADERBOARD
// =======================
function loadLeaderboard() {

    let leaderboard = JSON.parse(localStorage.getItem("ba_leaderboard")) || [];

    let boardDiv = document.getElementById("leaderboard");
    if (!boardDiv) return;

    boardDiv.innerHTML = "";

    if (leaderboard.length === 0) {
        boardDiv.innerHTML = "<p>Belum ada data.</p>";
        return;
    }

    leaderboard.forEach((player, index) => {

        let medal = "";
        if (index === 0) medal = "🥇";
        else if (index === 1) medal = "🥈";
        else if (index === 2) medal = "🥉";

        let row = document.createElement("div");
        row.className = "leaderboard-row";

        row.innerHTML = `
            <span>${medal} #${index + 1}</span>
            <span>${player.name}</span>
            <span>${player.mode}</span>
            <span>${player.score}</span>
        `;

        boardDiv.appendChild(row);
    });
}

// =======================
// LEADERBOARD CONFIG
// =======================
const STORAGE_KEY = "blue_archive_quiz_v1_leaderboard";
const ADMIN_PASSWORD = "Mika4love"; // ganti kalau mau

// =======================
// SAVE SCORE (FIXED)
// =======================
function saveScore() {

    if (!playerName) return;

    let leaderboard = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    leaderboard.push({
        name: playerName,
        mode: mode.toUpperCase(),
        score: correct,
        date: new Date().toLocaleDateString()
    });

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(leaderboard));
}

// =======================
// LOAD LEADERBOARD (FIXED)
// =======================
function loadLeaderboard() {

    let leaderboard = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let boardDiv = document.getElementById("leaderboard");

    if (!boardDiv) return;

    boardDiv.innerHTML = "";

    if (leaderboard.length === 0) {
        boardDiv.innerHTML = "<p>Belum ada data.</p>";
        return;
    }

    leaderboard.forEach((player, index) => {

        let medal = "";
        if (index === 0) medal = "🥇";
        else if (index === 1) medal = "🥈";
        else if (index === 2) medal = "🥉";

        let row = document.createElement("div");
        row.className = "leaderboard-row";

        row.innerHTML = `
            <span>${medal} #${index + 1}</span>
            <span>${player.name}</span>
            <span>${player.mode}</span>
            <span>${player.score}</span>
            <span>${player.date}</span>
        `;

        boardDiv.appendChild(row);
    });
}

// =======================
// RESET LEADERBOARD (ADMIN ONLY)
// =======================
function resetLeaderboard() {

    let input = prompt("Masukkan password admin untuk reset leaderboard:");

    if (input === null) return;

    if (input === ADMIN_PASSWORD) {
        localStorage.removeItem(STORAGE_KEY);
        loadLeaderboard();
        alert("Leaderboard berhasil direset!");
    } else {
        alert("Password salah! Akses ditolak.");
    }
}

// =======================
// AUTO LOAD SAAT BUKA HALAMAN
// =======================
window.addEventListener("load", () => {
    loadLeaderboard();
});

