let students = [];
let usedIndexes = [];
let correct = 0;
let wrong = 0;
let timer = 200;
let interval;
let mode = "";
let playerName = "";

// LOAD JSON
fetch("BlueArchive_Students_FULL_REAL.json")
    .then(res => res.json())
    .then(data => {
        students = data;
    });

// =======================
// START GAME
// =======================
function startGame(selectedMode) {

    playerName = document.getElementById("playerName").value.trim();
    if (playerName === "") return alert("Masukkan nama dulu!");

    mode = selectedMode;

    // RESET SEMUA
    correct = 0;
    wrong = 0;
    timer = 200;
    usedIndexes = [];
    clearInterval(interval);

    document.getElementById("correct").textContent = 0;
    document.getElementById("wrong").textContent = 0;
    document.getElementById("timer").textContent = timer;

    document.getElementById("startScreen").classList.add("hidden");
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
// RANDOM STUDENT (NO REPEAT)
// =======================
function getRandomStudent() {

    if (usedIndexes.length === students.length) {
        endGame();
        return null;
    }

    let index;
    do {
        index = Math.floor(Math.random() * students.length);
    } while (usedIndexes.includes(index));

    usedIndexes.push(index);
    return students[index];
}

// =======================
// NEXT QUESTION
// =======================
function nextQuestion() {

    let student = getRandomStudent();
    if (!student) return;

    let questionText = "";
    let correctAnswer = "";
    let options = [];

    // =======================
    // CASUAL MODE
    // =======================
    if (mode === "casual") {

        let type = Math.floor(Math.random() * 5); // jadi 5 tipe (0-4)

        // 1️⃣ Nama dari Sekolah
        if (type === 0 && student.sekolah) {
            questionText = `Siapakah murid dari sekolah ${student.sekolah}?`;
            correctAnswer = student.nama;
            options.push(student.nama);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (!options.includes(r.nama)) {
                    options.push(r.nama);
                }
            }
        }

        // 2️⃣ Sekolah dari Nama
        else if (type === 1 && student.sekolah) {
            questionText = `${student.nama} berasal dari sekolah apa?`;
            correctAnswer = student.sekolah;
            options.push(student.sekolah);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (r.sekolah && !options.includes(r.sekolah)) {
                    options.push(r.sekolah);
                }
            }
        }

        // 3️⃣ Klub
        else if (type === 2 && student.klub) {
            questionText = `${student.nama} tergabung dalam klub apa?`;
            correctAnswer = student.klub;
            options.push(student.klub);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (r.klub && !options.includes(r.klub)) {
                    options.push(r.klub);
                }
            }
        }

        // 4️⃣ Attack Type
        else if (type === 3 && student.attack) {
            questionText = `Apa tipe Attack ${student.nama}?`;
            correctAnswer = student.attack;
            options.push(student.attack);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (r.attack && !options.includes(r.attack)) {
                    options.push(r.attack);
                }
            }
        }

        // 5️⃣ Armor Type
        else if (type === 4 && student.armor) {
            questionText = `Apa tipe Armor dari ${student.nama}?`;
            correctAnswer = student.armor;
            options.push(student.armor);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (r.armor && !options.includes(r.armor)) {
                    options.push(r.armor);
                }
            }
        }
    }

    // =======================
    // COMPE MODE (HARD)
    // =======================
    else {

        let type = Math.floor(Math.random() * 11);

        // ================================
        // NORMAL QUESTION (jawab isi data)
        // ================================

        // EX Skill
        if (type === 0 && student.ex_skill) {
            questionText = `Apa EX Skill dari ${student.nama}?`;
            correctAnswer = student.ex_skill;
            options.push(student.ex_skill);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (r.ex_skill && !options.includes(r.ex_skill)) {
                    options.push(r.ex_skill);
                }
            }
        }

        // Attack
        else if (type === 1 && student.attack) {
            questionText = `Apa tipe Attack dari ${student.nama}?`;
            correctAnswer = student.attack;
            options.push(student.attack);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (r.attack && !options.includes(r.attack)) {
                    options.push(r.attack);
                }
            }
        }

        // Armor
        else if (type === 2 && student.armor) {
            questionText = `Apa tipe Armor dari ${student.nama}?`;
            correctAnswer = student.armor;
            options.push(student.armor);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (r.armor && !options.includes(r.armor)) {
                    options.push(r.armor);
                }
            }
        }

        // Klub
        else if (type === 3 && student.klub) {
            questionText = `${student.nama} berasal dari klub apa?`;
            correctAnswer = student.klub;
            options.push(student.klub);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (r.klub && !options.includes(r.klub)) {
                    options.push(r.klub);
                }
            }
        }

        // Basic Skill
        else if (type === 4 && student.basic_skill) {
            questionText = `Apa Basic Skill dari ${student.nama}?`;
            correctAnswer = student.basic_skill;
            options.push(student.basic_skill);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (r.basic_skill && !options.includes(r.basic_skill)) {
                    options.push(r.basic_skill);
                }
            }
        }

        // Passive Skill
        else if (type === 5 && student.passive_skill) {
            questionText = `Apa Passive Skill dari ${student.nama}?`;
            correctAnswer = student.passive_skill;
            options.push(student.passive_skill);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (r.passive_skill && !options.includes(r.passive_skill)) {
                    options.push(r.passive_skill);
                }
            }
        }

        // Sub Skill
        else if (type === 6 && student.sub_skill) {
            questionText = `Apa Sub Skill dari ${student.nama}?`;
            correctAnswer = student.sub_skill;
            options.push(student.sub_skill);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (r.sub_skill && !options.includes(r.sub_skill)) {
                    options.push(r.sub_skill);
                }
            }
        }

        // ===================================
        // REVERSE QUESTION (jawab nama siswa)
        // ===================================

        // EX Skill → Nama
        else if (type === 7 && student.ex_skill) {
            questionText = `Siapa pemilik EX Skill berikut?\n"${student.ex_skill}"`;
            correctAnswer = student.nama;
            options.push(student.nama);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (!options.includes(r.nama)) {
                    options.push(r.nama);
                }
            }
        }

        // Basic Skill → Nama
        else if (type === 8 && student.basic_skill) {
            questionText = `Siapa pemilik Basic Skill berikut?\n"${student.basic_skill}"`;
            correctAnswer = student.nama;
            options.push(student.nama);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (!options.includes(r.nama)) {
                    options.push(r.nama);
                }
            }
        }

        // Passive Skill → Nama
        else if (type === 9 && student.passive_skill) {
            questionText = `Siapa pemilik Passive Skill berikut?\n"${student.passive_skill}"`;
            correctAnswer = student.nama;
            options.push(student.nama);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (!options.includes(r.nama)) {
                    options.push(r.nama);
                }
            }
        }

        // Sub Skill → Nama
        else if (type === 10 && student.sub_skill) {
            questionText = `Siapa pemilik Sub Skill berikut?\n"${student.sub_skill}"`;
            correctAnswer = student.nama;
            options.push(student.nama);

            while (options.length < 4) {
                let r = students[Math.floor(Math.random() * students.length)];
                if (!options.includes(r.nama)) {
                    options.push(r.nama);
                }
            }
        }
    }

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

    document.getElementById("gameScreen").classList.add("hidden");
    document.getElementById("resultScreen").classList.remove("hidden");

    let gradeText = "";

    if (correct >= 20) {
        gradeText = "🔥 INIMAH RAJA MALDING 🔥";
    } else if (correct >= 15) {
        gradeText = "💎 GG Sensei";
    } else if (correct >= 10) {
        gradeText = "✨ NICE TRY";
    } else {
        gradeText = "🫠 Butuh Farming Lagi";
    }

    document.getElementById("resultText").innerHTML =
        `<p>Nama: <b>${playerName}</b></p>
         <p>Mode: <b>${mode.toUpperCase()}</b></p>
         <p>Benar: <b>${correct}</b></p>
         <p>Salah: <b>${wrong}</b></p>`;

    document.getElementById("grade").textContent = gradeText;
}
