document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const questionScreen = document.getElementById('question-screen');
    const resultScreen = document.getElementById('result-screen');
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');

    const progressBar = document.getElementById('progress');
    const pageNumber = document.getElementById('page-number');
    const questionText = document.getElementById('question-text');
    const answerButtons = document.getElementById('answer-buttons');
    const resultList = document.getElementById('result-list');

    let currentQuestionIndex = 0;
    const userAnswers = [];

    const questions = [
        { question: "성별을 선택해주세요.", options: ["남자", "여자"] },
        { question: "1. 중학교 내신점수는 어느 구간인가요?", options: ["290점 이상", "280~289점", "270~279점", "260~269점", "250~259점", "240~249점", "230~239점", "220~229점", "210~219점", "200~209점", "190~199점", "180~189점", "180점 미만"] },
        { question: "2. 목표 대학 수준은 어느 쪽인가요?", options: ["의·치·한·SKY 등 최상위권 대학", "수도권 주요 대학", "지역 국립대", "전문 특성화 계열", "아직 구체적 목표 없음"] },
        { question: "3. 희망하는 전형은 무엇인가요?", options: ["정시 (수능 중심)", "수시 교과 (내신 중심)", "수시 학종 (내신+생기부, 세특)", "모르겠음"] },
        { question: "4. 상위권 심화반(ex: 경구고 sky)은 필요한가요?", options: ["네", "아니요(상관없음)", "모르겠음"] },
        { question: "5. 교내 비교과 활동(동아리·탐구·프로젝트)는 중요한가요?", options: ["중요함", "상관없음", "모르겠음"] },
        { question: "6. 스쿨버스(통학버스)가 필요한가요?", options: ["네", "아니요"] },
        { question: "7. 내신 경쟁 정도는 어떤 학교가 더 좋다고 생각하나요?", options: ["경쟁이 심한 학교 (상위권 모여 있음)", "경쟁이 적당한 학교 (평균적인 수준)", "경쟁이 덜한 학교 (편하게 다니고 싶다)", "상관없음"] },
        { question: "8. 학교 유형에 대한 선호는 어떤가요?", options: ["일반계", "특성화고", "외고", "모르겠음"] },
        { question: "9. 공학과 별학 중 무엇을 선호하나요?", options: ["별학(남고, 여고)", "공학", "모르겠음"] },
        { question: "10. 학교 시설은 중요하다고 생각하나요?", options: ["네 (기본 시설은 잘 갖춰져 있어야 한다)", "아니요 (다른 조건이 더 중요함)", "모르겠음"] },
        { question: "11. 급식의 맛과 질은 학교 선택에 영향을 준다고 생각하나요?", options: ["매우 그렇다 (급식이 맛있으면 학교 만족도가 높아진다)", "어느 정도 그렇다 (보통 수준이면 괜찮다)", "별로 상관없다 (중요하지 않다)", "모르겠음"] },
        { question: "12. 학교에 기숙사가 있는 것이 중요하다고 생각하나요?", options: ["네", "아니요", "모르겠음"] },
        { question: "13. 나 자신한테 한마디!", type: 'text' }
    ];

    const schoolData = {
        gyeonggu: {
            name: "경구고등학교",
            type: "일반계 / 남자고등학교",
            gender: "male",
            recommendation: "최상위권 대학 진학을 목표로 하는 남학생",
            bus: "✅ 있음 (구미 전지역 운행)",
            dorm: "✅ 있음 (최신식 기숙사 운영)",
            advancedClass: "✅ 있음 (SKY반, 의치대반 등 최상위권 심화반 운영)",
            atmosphere: "학업 중심, 높은 경쟁률, 강력한 대입 지원 시스템"
        },
        gumi_gh: {
            name: "구미여자고등학교",
            type: "일반계 / 여자고등학교",
            gender: "female",
            recommendation: "체계적인 학습 관리와 우수한 대입 결과를 원하는 여학생",
            bus: "❔ 학교별 상이",
            dorm: "✅ 있음",
            advancedClass: "✅ 있음 (수준별 심화반 운영)",
            atmosphere: "높은 학업 성취도, 우수한 면학 분위기, 다양한 동아리 활동"
        },
        gyeongbuk_fl: {
            name: "경북외국어고등학교",
            type: "특목고 / 남녀공학",
            gender: "coed",
            recommendation: "외국어 계열 및 상위권 대학 진학을 목표하는 학생",
            bus: "✅ 있음 (특목고 특성상 통학버스 운영)",
            dorm: "✅ 있음 (예지관, 남녀 분리형, 2~4인실)",
            advancedClass: "✅ 있음 (영어·제2외국어 심화트랙 및 대학 진학반 운영)",
            atmosphere: "학업 중심, 상위권 학생 비율 높음, 외국어 특화 교육"
        },
        default_coed: {
            name: "일반 공학고등학교",
            type: "일반계 / 남녀공학",
            gender: "coed",
            recommendation: "균형잡힌 학교 생활과 안정적인 내신 관리를 원하는 학생",
            bus: "❔ 학교별 상이",
            dorm: "❔ 학교별 상이",
            advancedClass: "❔ 학교별 상이",
            atmosphere: "일반적인 학교 분위기, 다양한 수준의 학생들이 함께 공부"
        }
    };

    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', handleNextButton);

    function startQuiz() {
        startScreen.classList.add('hidden');
        questionScreen.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        answerButtons.innerHTML = '';
        nextBtn.classList.add('hidden');
        const currentQuestion = questions[currentQuestionIndex];

        const progressPercentage = (currentQuestionIndex / (questions.length - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        pageNumber.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
        questionText.textContent = currentQuestion.question;

        if (currentQuestion.type === 'text') {
            const input = document.createElement('input');
            input.type = 'text';
            input.id = 'q13-input';
            input.placeholder = '자유롭게 생각을 남겨주세요.';
            answerButtons.appendChild(input);
            nextBtn.textContent = '결과 보기';
            nextBtn.classList.remove('hidden');
        } else {
            currentQuestion.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.classList.add('btn');
                button.textContent = option;
                button.addEventListener('click', () => selectAnswer(index));
                answerButtons.appendChild(button);
            });
        }
    }

    function selectAnswer(answerIndex) {
        userAnswers[currentQuestionIndex] = answerIndex;
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                showQuestion();
            } else {
                calculateAndShowResult();
            }
        }, 300);
    }

    function handleNextButton() {
        if (questions[currentQuestionIndex].type === 'text') {
            const input = document.getElementById('q13-input');
            userAnswers[currentQuestionIndex] = input.value;
            calculateAndShowResult();
        }
    }

    function calculateAndShowResult() {
        const scores = {
            gyeonggu: 0,
            gumi_gh: 0,
            gyeongbuk_fl: 0,
            default_coed: 0
        };

        // Scoring Logic
        if (userAnswers[1] <= 3) { scores.gyeonggu += 30; scores.gumi_gh += 20; }
        if (userAnswers[1] <= 1) scores.gyeongbuk_fl += 20;
        if (userAnswers[2] === 0) { scores.gyeonggu += 35; scores.gumi_gh += 25; }
        if (userAnswers[2] === 1) { scores.gyeonggu += 20; scores.gumi_gh += 15; }
        if (userAnswers[2] <= 1) scores.gyeongbuk_fl += 25;
        if (userAnswers[3] === 0 || userAnswers[3] === 2) { scores.gyeonggu += 15; scores.gumi_gh += 10; }
        if (userAnswers[4] === 0) { scores.gyeonggu += 40; scores.gumi_gh += 30; }
        if (userAnswers[5] === 0) { scores.gyeonggu += 15; scores.gumi_gh += 15; scores.gyeongbuk_fl += 10; }
        if (userAnswers[7] === 0) { scores.gyeonggu += 30; scores.gumi_gh += 25; }
        if (userAnswers[7] === 1) scores.default_coed += 10;
        if (userAnswers[8] === 2) scores.gyeongbuk_fl += 40;
        if (userAnswers[8] === 0) { scores.gyeonggu += 10; scores.gumi_gh += 10; }
        if (userAnswers[9] === 0) { scores.gyeonggu += 50; scores.gumi_gh += 50; }
        if (userAnswers[9] === 1) scores.default_coed += 20;
        if (userAnswers[12] === 0) { scores.gyeonggu += 10; scores.gumi_gh += 15; scores.gyeongbuk_fl += 10; }
        scores.gyeonggu += 20; // Base preference

        let schoolScores = Object.keys(scores).map(key => ({
            id: key,
            ...schoolData[key],
            score: scores[key]
        }));

        const selectedGender = userAnswers[0] === 0 ? 'male' : 'female';
        schoolScores = schoolScores.filter(school => school.gender === selectedGender || school.gender === 'coed');

        schoolScores.sort((a, b) => b.score - a.score);

        if (selectedGender === 'male' && schoolScores.length > 1 && schoolScores[0].id === 'gyeonggu') {
            if (Math.random() > 0.8) { // 20% chance to demote
                const temp = schoolScores[0];
                schoolScores[0] = schoolScores[1];
                schoolScores[1] = temp;
            }
        }

        displayResults(schoolScores.slice(0, 3));
    }

    function displayResults(topSchools) {
        resultList.innerHTML = '';
        topSchools.forEach((school, index) => {
            if (!school) return;
            const rank = index + 1;
            const resultCard = document.createElement('div');
            resultCard.className = 'result-section';
            
            const rankColor = { 1: '#007bff', 2: '#17a2b8', 3: '#28a745' }[rank] || '#6c757d';

            resultCard.innerHTML = `
                <h2 style="color: ${rankColor}; border-bottom: 2px solid ${rankColor}; padding-bottom: 10px;">
                    ${rank}위: ${school.name}
                </h2>
                <p><strong>학교유형 / 남녀 구분:</strong> ${school.type}</p>
                <p><strong>추천 대상:</strong> ${school.recommendation}</p>
                <p><strong>통학버스:</strong> ${school.bus}</p>
                <p><strong>기숙사:</strong> ${school.dorm}</p>
                <p><strong>상위권 심화반:</strong> ${school.advancedClass}</p>
                <p><strong>학교 분위기:</strong> ${school.atmosphere}</p>
            `;
            resultList.appendChild(resultCard);
        });

        questionScreen.classList.add('hidden');
        resultScreen.classList.remove('hidden');
    }
});