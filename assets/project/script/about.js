// About Carousel
const images = [
    {
      label: 'Manoj Shrestha',
      semester : '7th sem',
      imgPath: 'https://sthamanoj.com.np/assets/project/public/Manoj Shrestha.jpg',
    },
    {
      label: 'Usha Gurung',
      semester : '7th sem',
      imgPath: 'https://sthamanoj.com.np/assets/project/public/Usha Gurung.jpeg',
    },
    {
      label: 'Pramita Gahatraj',
      semester : '6th sem',
      imgPath: 'https://sthamanoj.com.np/assets/project/public/Pramita Gahatraj.png',
    },
    {
      label: 'Prabin Ale',
      semester : '3rd sem',
      imgPath: 'https://sthamanoj.com.np/assets/project/public/Prabin Ale.png',
    },
    {
      label: 'Manjib Kumar Batas',
      semester : '1st sem',
      imgPath: 'https://sthamanoj.com.np/assets/project/public/Manjib Kumar Batas.png',
    }
  ];
  
  let activeStep = 0;
  const maxSteps = images.length;
  
  const imageLabel = document.getElementById('imageLabel');
  const imageDesc = document.getElementById('imageDesc');
  const imageView = document.getElementById('imageView');
  const backButton = document.getElementById('backButton');
  const nextButton = document.getElementById('nextButton');
  
  function updateUI() {
    imageLabel.innerText = images[activeStep].label;
    imageDesc.innerText = images[activeStep].semester;
    imageView.innerHTML = `<img src="${images[activeStep].imgPath}" alt="${images[activeStep].label}">`;
  
    backButton.disabled = activeStep === 0;
    nextButton.disabled = activeStep === maxSteps    - 1;
  }
  
  function handleNext() {
    if (activeStep < maxSteps - 1) {
      activeStep++;
      updateUI();
    }
  }
  
  function handleBack() {
    if (activeStep > 0) {
      activeStep--;
      updateUI();
    }
  }
  
  nextButton.addEventListener('click', handleNext);
  backButton.addEventListener('click', handleBack);
  
  updateUI(); // Initial UI update
  