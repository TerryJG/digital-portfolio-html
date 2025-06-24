function initHoverEffect() {
  const maxScreenWidth = 768;

  function applyHoverEffect() {
      let hoverImageVisible = false;
      const fadeDuration = 400;

      $(".video-item").hover(
          function () { // Mouse hover
              if (!hoverImageVisible) {
                  const videoElement = $(this).find("video#hoverPreview")[0];
                  videoElement.play(); // Play the video
                  $(this).find("#thumbnailImage").fadeOut(fadeDuration);
                  $(this).find("#playIcon").css("text-shadow", "none").fadeOut(fadeDuration);
              }
          },
          function () { // Mouse leave
              const videoElement = $(this).find("video#hoverPreview")[0];
              $(this).find("#thumbnailImage, #playIcon").fadeIn(fadeDuration, function () {
                  // Callback function after fadeIn is complete
                  videoElement.pause(); // Pause the video
                  videoElement.currentTime = 0; // Reset to the beginning
              });
              hoverImageVisible = false;
          }
      );

      // Reset GIF animation
      $(".toggle-hover-image").on("click", function () {
          hoverImageVisible = !hoverImageVisible;
          $(".video-item .fancybox").trigger("mouseenter");
      });
  }

  function removeHoverEffect() {
      $(".video-item .fancybox").off("mouseenter mouseleave click");
      // Set display to none for elements with specified IDs
      $(".video-item video#hoverPreview").css("display", "none");
  }

  $(window).on("load", function () {
      if (window.innerWidth > maxScreenWidth) {
          applyHoverEffect();
      } else {
          removeHoverEffect();
      }
  });

  $(window).resize(function () {
      if (window.innerWidth > maxScreenWidth) {
          applyHoverEffect();
      } else {
          removeHoverEffect();
      }
  });
}

initHoverEffect();