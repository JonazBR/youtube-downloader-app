$(function () {

    let searchTerm = "phonk";
    let videoList = $("#videoList");
      //search(searchTerm);

    $("#searchForm").on("submit", (e) => {
        e.preventDefault();
        searchTerm = $("#searchField").val();
        search(searchTerm);
    });

    function search(query) {

        $.ajax({
            method: "GET",
            url: "/search",
            data: {
                type: "query",
                query: query,


            }
        }).done((data) => {

            clearVideoList();

            data.map((video) => {
                const color = {
                    r: video.average.r,
                    g: video.average.g,
                    b: video.average.b,

                }

              
                videoList.append(`<li class="media mb-2" id="${video.videoId}" style="background: linear-gradient(rgb(${color.r}, ${color.g}, ${color.b}), rgb(0,0,0,0.80));border-bottom: 4px solid rgb(${color.r}, ${color.g}, ${color.b}, 0.20);">

                <img src="${video.thumbnail}" class="mr-3">
                <div class="media-body">
                  <h5 class="mt-0 mb-1">${video.title}</h5>
                  <h6 class="my-1 text-info">${video.author.name}</h6>

                </div>
                <span class="time"> ${video.timestamp}</span>

              </li>`);
         


             

            });


           
           
        }).fail(function (data) {
            console.log(data);
        });
    }

    function clearVideoList() {
        videoList.find(".media").remove();
    }

    

    //select the video
    videoList.on("click", "li", function () {
        let id = $(this).attr("id");
        window.location.href = "/download?id=" + id
    });


});


