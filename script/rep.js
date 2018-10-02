(function() {

    "use strict";

    const getRepDetail = localStorage.repositoryUri;
    const boxRep = $(".repository")


    $.ajax({
        url: getRepDetail,
        dataType: "json",
        complete: function(data) {
            const json = data.responseJSON;

            if (json.message == "Not Found") {
                console.log("Repositório não encontrado")
            } else {

                boxRep.addClass("rep--visible")
                boxRep.removeClass("rep--hidden")

                const name = json.name;
                const description = json.description;
                const stars = json.stargazers_count;
                const language = json.language;
                const link = json.svn_url;

                $("[data-js-name]").html(name)
                $("[data-js-desc]").html(description)
                $("[data-js-stars]").html(stars)
                $("[data-js-language]").html(language)
                $("[data-js-link]").attr("href", link)
            }
        }
    })

})();