$(document).ready(function() {
   $("#searchfor").focus();
   $("#search").click(function() {
      var search = $("#searchfor").val();
      var url =
         "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
         search +
         "&callback=?";

      $.ajax({
         type: "GET",
         url: url,
         async: false,
         dataType: "json",
         success: function(data) {
            // console.log(data);
            //  使用postman可以查看詳細資料,還可選擇規格

            $("#output").empty();

            for (var i = 0; i < data[2].length; i++) {
               if (i === data[2].length - 1) {
                  $("#output").append(
                     "<li><a href=" +
                        data[3][i] +
                        ">" +
                        data[1][i] +
                        " </a>" +
                        data[2][i] +
                        "</li>"
                  );
               } else {
                  $("#output").append(
                     "<li><a href=" +
                        data[3][i] +
                        ">" +
                        data[1][i] +
                        " </a>" +
                        data[2][i] +
                        "</li><hr>"
                  );
               }
            }
            $("#output").addClass("allResult");
            $("#searchfor").val("");
         },
         error: function(err) {
            alert("Empty Content");
         }
      });
   });

   $("#searchfor").keypress(function(event) {
      if (event.which === 13 && $("#searchfor").val() !== "") {
         $("#search").click();
         $("li").remove();
         render();
      }
   });
   const url = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&limit=7&origin=*";
   const getSuggestList = keyword =>
      fetch(url + "&search=" + keyword, {
         method: "GET",
         mode: "cors"
      }).then(res => res.json());

   const searchInput = document.getElementById("searchfor");
   const suggestList = document.getElementById("suggestion");

   const obj = Rx.Observable
   const keyword = obj.fromEvent(searchInput, "input");
   const selectItem = obj.fromEvent(suggestList, "click");

   const render = (suggestArr = []) =>
      (suggestList.innerHTML = suggestArr
         .map(item => "<li>" + item + "</li>")
         .join(""));

   keyword
      .debounceTime(50)
      .switchMap(e => getSuggestList(e.target.value), (e, res) => res[1])
      .subscribe(list => render(list));

   selectItem
      .filter(e => e.target.matches("li"))
      .map(e => e.target.innerText)
      .subscribe(text => {
         searchInput.value = text;
         render(); // init
      });
});


$('input').keydown(function(e) {
    var key = e.which,
        $selected = $('li').filter('.selected'),
        $current;

    if ( key > 40 && key < 37 ) return;

    $('li').removeClass('selected');

    if ( key == 39 || key == 40) // right or down key
    {
        if ( ! $selected.length || $selected.is(':last-child') ) {
            $current = $('li:first');
        }
        else $current = $selected.next();
    }
    else if ( key == 37 || key == 38 ) 
    {
        if ( ! $selected.length || $selected.is(':first-child') ) {
            $current = $('li:last');
        }
        else $current = $selected.prev();
        
    }
    $current.addClass('selected');
    $(this).val ( $current.addClass('selected').text() );   
});
