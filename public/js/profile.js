


  function openList(type) {
    const list = type === "followers" ? followers : following;

    document.getElementById("listTitle").innerText =
      type === "followers" ? "Followers" : "Following";

    document.getElementById("listContent").innerHTML = list.length
      ? list.map(u => `
          <div class="list-user">
            <img src="${u.profileImage || '/images/default-image.png'}">
            <span>${u.name}</span>
          </div>
        `).join("")
      : `<p class="empty-list">No users found.</p>`;

    document.getElementById("overlay").style.display = "block";
    document.getElementById("listCard").style.display = "block";
  }

  function closeList() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("listCard").style.display = "none";
  }
  document.querySelectorAll(".like-form").forEach((form) => {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const postId = this.dataset.postId;
      const heart = this.querySelector(".heart");
      const count = this.querySelector(".like-count");

      const res = await fetch(`/post/${postId}/like`, {
        method: "POST"
      });

      const data = await res.json();

      if (data.success) {
        heart.textContent = data.liked ? "❤️" : "♡";
        count.textContent = data.likesCount;
      }
    });
  });



  document.querySelectorAll(".like-form").forEach((form) => {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const postId = this.dataset.postId;
      const heart = this.querySelector(".heart");
      const count = this.querySelector(".like-count");

      const res = await fetch(`/post/${postId}/like`, {
        method: "POST"
      });

      const data = await res.json();

      if (data.success) {
        heart.textContent = data.liked ? "❤️" : "♡";
        count.textContent = data.likesCount;
      }
    });
  });


  let activePostId = null;

  function openComments(postId) {
    activePostId = postId;

    const post = allPosts.find(p => p._id.toString() === postId);
  

    const commentList = document.getElementById("commentList");

    commentList.innerHTML = post.comments.length
      ? post.comments.map(c => `
          <div class="comment-user">
            <img src="${c.user?.profileImage || '/images/default-profile.png'}">
            <div>
              <strong>${c.user?.name || 'Unknown User'}</strong>
              <p>${c.text}</p>
            </div>
          </div>
        `).join("")
      : `<p class="empty-list">No comments yet.</p>`;

    document.getElementById("commentOverlay").style.display = "block";
    document.getElementById("commentCard").style.display = "block";
  }

  function closeComments() {
    document.getElementById("commentOverlay").style.display = "none";
    document.getElementById("commentCard").style.display = "none";
    document.getElementById("commentInput").value = "";
  }

  document.getElementById("commentForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const input = document.getElementById("commentInput");
    const text = input.value.trim();

    if (!text) return;

    const res = await fetch(`/post/${activePostId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    if (data.success) {
      const commentList = document.getElementById("commentList");

      const empty = commentList.querySelector(".empty-list");
      if (empty) empty.remove();

      commentList.insertAdjacentHTML("afterbegin", `
        <div class="comment-user">
          <img src="${data.comment.user?.profileImage || '/images/default-profile.png'}">
          <div>
            <strong>${data.comment.user?.name || 'You'}</strong>
            <p>${data.comment.text}</p>
          </div>
        </div>
      `);

      document.getElementById(`comment-count-${activePostId}`).innerText = data.commentsCount;
      input.value = "";
    }
  });