const searchInputUser = $('#user');
const searchButton = $('.search__button');
const orderButton = $('.order__button');
const boxUser = $(".user")

// - buscar por um usuário do GitHub;
searchButton.click(function (event) {
    event.preventDefault();

    if(!(boxUser.hasClass("user--hidden"))){
        boxUser.removeClass("user--visible")
        boxUser.addClass("user--hidden")
    }
    
    const username = searchInputUser.val();
    const getUser = `https://api.github.com/users/${username}`;
    const getUserRepos = `https://api.github.com/users/${username}/repos`;

    
    // - ver uma página com os detalhes de um repositório (nome, descrição, ,número de estrelas, linguagem e um link externo para a página do repositório no GitHub), que pode ser clicado na listagem dos repositórios;

    $.ajax({
        url: getUser,
        dataType: "json",
        complete: function (data) {
            const json = data.responseJSON;

            if (json.message == "Not Found" || username == '') {
                console.log("Usuário não encontrado")
            } else {

                boxUser.addClass("user--visible")
                boxUser.removeClass("user--hidden")

                const name = json.name;
                const user = json.login;
                const avatar = json.avatar_url;
                const bio = json.bio;
                const email = json.email;
                const followers = json.followers;
                const following = json.following;

                // - ver os detalhes desse usuário que foi buscado (número de seguidores, número de seguidos, imagem do avatar, e-mail e bio);
                $("[data-js-name]").html(name)
                $("[data-js-user]").html(user)
                $("[data-js-email]").html(email)
                $("[data-js-bio]").html(bio)
                $("[data-js-followers]").html(followers)
                $("[data-js-following]").html(following)
                $("[data-js-avatar]").attr("src", avatar)

                // - ver a listagem dos repositórios desse usuário que foi buscado, ordenados pelo número decrescente de estrelas;
                let repositories;
                $.getJSON(getUserRepos, function (json) {
                    repositories = json;
                    if (repositories.length == 0) {
                        console.log("Sem repositorios")
                    } else {
                        let sortStar = [];
                        for (let repo in repositories) {
                            sortStar.push([repositories[repo], repositories[repo].stargazers_count]);
                        }

                        let repoByStar = sortStar.sort(function(a, b) {
                            return b[1] - a[1];
                        });

                        // - poder alterar a ordem da listagem de repositórios;
                        orderButton.click(function(){
                            const ordering = this.dataset.order;
                            $(".user__repos").find("a").remove();

                            if(ordering === "true"){
                                this.dataset.order = false;

                                let repoByStar = sortStar.sort(function(a, b) {
                                    return a[1] - b[1];
                                });

                                listRepos()

                                return false
                            }
                            this.dataset.order = true;

                            let repoByStar = sortStar.sort(function(a, b) {
                                return b[1] - a[1];
                            });

                            listRepos()

                            return true
                        })

                        listRepos()

                        function listRepos(){
                            $.each(repoByStar, function (index) {
                                let item = repoByStar[index][0];
    
                                const link =  document.createElement("a");
                                const linkName = document.createTextNode(item.name + " " + item.stargazers_count)
    
                                link.setAttribute("href", "rep.html");
                                link.setAttribute("data-uri", `https://api.github.com/repos/${item.full_name}`);
                                // link.setAttribute("target", "_blank");
                                link.appendChild(linkName);
                                link.className = "button";

                                link.addEventListener("click", function(e){
                                    e.preventDefault();
                                    const repoUri = this.dataset.uri;
                                    localStorage.repositoryUri = repoUri;
                                    window.open("rep.html", "_blank");
                                })
    
                                $(".user__repos")[0].appendChild(link);
                            });
                        }
                    }
                });


            } 
        }
    });

})