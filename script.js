// =======================
// 🔥 FIREBASE CONFIG
// =======================

const firebaseConfig = {
    apiKey: "AIzaSyDWl5TsHfA25l_vzAzAEXZuNir6gDA5OHA",
    authDomain: "blue-archive-quiz.firebaseapp.com",
    databaseURL: "https://blue-archive-quiz-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "blue-archive-quiz",
    storageBucket: "blue-archive-quiz.firebasestorage.app",
    messagingSenderId: "881862409195",
    appId: "1:881862409195:web:718781e6d88ccd4482b7ae",
    measurementId: "G-XRKXSR415B"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

//variabel game
const database = firebase.database();
let students = [];
let usedIndexes = [];
let correct = 0;
let wrong = 0;
let timer = 120;
let interval;
let mode = "";
let playerName = "";
let dataLoaded = false;
let scoreSubmitted = false;

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

    scoreSubmitted = false;
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

    submitScore();
}

// =======================
// 🔥 ANTI SPAM SUBMIT
// =======================

function submitScore() {

    if (scoreSubmitted) return;
    scoreSubmitted = true;

    const now = Date.now();
    const nameKey = playerName.toLowerCase().trim();

    const leaderboardRef = database.ref("leaderboard");

    leaderboardRef.child(nameKey).once("value", snapshot => {

        if (snapshot.exists()) {

            const oldData = snapshot.val();
            const oldScore = oldData.score;

            // 🔥 Jika score baru lebih besar atau sama → update
            if (correct >= oldScore) {

                leaderboardRef.child(nameKey).update({
                    name: playerName,
                    score: correct,
                    mode: mode.toUpperCase(),
                    timestamp: now
                });

                console.log("Score diupdate!");

            } else {

                console.log("Score lebih kecil, tidak diupdate.");

            }

        } else {

            // 🔥 Jika belum ada → buat baru
            leaderboardRef.child(nameKey).set({
                name: playerName,
                score: correct,
                mode: mode.toUpperCase(),
                timestamp: now
            });

            console.log("Score baru ditambahkan!");
        }

    });

}



// =======================
// REALTIME LEADERBOARD
// =======================

function loadLeaderboard() {

    let boardDiv = document.getElementById("leaderboard");
    if (!boardDiv) return;

    database.ref("leaderboard")
        .once("value", snapshot => {

            boardDiv.innerHTML = "";

            let data = [];

            snapshot.forEach(child => {
                data.push(child.val());
            });

            // 🔥 Sort manual
            data.sort((a, b) => b.score - a.score);

            // 🔥 Ambil 10 teratas
            data = data.slice(0, 10);

            if (data.length === 0) {
                boardDiv.innerHTML = "<p>Belum ada data.</p>";
                return;
            }

            data.forEach((player, index) => {

                let medal = "";
                if (index === 0) medal = "🥇";
                else if (index === 1) medal = "🥈";
                else if (index === 2) medal = "🥉";

                let row = document.createElement("div");
                row.className = "leaderboard-row";

                row.innerHTML = `
                    <span>${medal} #${index + 1}</span>
                    <span>${player.name}</span>
                    <span>${player.score} Benar</span>
                    <span>${player.mode}</span>
                `;

                boardDiv.appendChild(row);
            });

        });
}

// =======================
// ADMIN RESET
// =======================

const ADMIN_PASSWORD = "Mika4love";

function resetLeaderboard() {

    let input = prompt("Masukkan password admin:");

    if (input === ADMIN_PASSWORD) {
        database.ref("leaderboard").remove();
        alert("Leaderboard berhasil direset!");
    } else {
        alert("Password salah!");
    }
}

// =======================
// AUTO LOAD
// =======================

window.addEventListener("load", () => {
    loadLeaderboard();
});
