var app = new Vue(
  {
    el:"#root",
    data: {
      noActives: false,
      lastSavedDate: "",
      lastSavedBefore: "",
      isWriting: false,
      menuIndex: 0,
      toSend: "",
      search: "",
      contacts: [
	      {
		      name: 'Michele',
          avatar: 'img/michele.png',
          active: false,
		      messages: [
			      {
				      date: '01/10/2020 15:30:55',
				      text: 'Hai portato a spasso il cane?',
				      status: 'sent',
              isHideMenu: false
			      },
			      {
				      date: '01/10/2020 15:50:00',
				      text: 'Ricordati di dargli da mangiare',
				      status: 'sent',
              isHideMenu: false
			      },
			      {
				      date: '01/10/2020 16:15:22',
				      text: 'Tutto fatto!',
				      status: 'received',
              isHideMenu: false
			      }
		      ],
	      },
	      {
		      name: 'Fabio',
		      avatar: 'img/fabio.png',
          active: false,
		      messages: [
			      {
				      date: '03/20/2020 16:30:00',
				      text: 'Ciao come stai?',
				      status: 'sent',
              isHideMenu: false
			      },
			      {
				      date: '03/20/2020 16:30:55',
				      text: 'Bene grazie! Stasera ci vediamo?',
				      status: 'received',
              isHideMenu: false
			      },
			      {
				      date: '03/20/2020 16:35:00',
				      text: 'Mi piacerebbe ma devo andare a fare la spesa.',
				      status: 'sent',
              isHideMenu: false
			      }
		      ],
	      },
	      {
		      name: 'Samuele',
		      avatar: 'img/samuele.png',
          active: false,
		      messages: [
			      {
				      date: '03/28/2020 10:10:40',
				      text: 'La Marianna va in campagna',
				      status: 'received',
              isHideMenu: false
			      },
			      {
				      date: '03/28/2020 10:20:10',
				      text: 'Sicuro di non aver sbagliato chat?',
				      status: 'sent',
              isHideMenu: false
			      },
			      {
				      date: '03/28/2020 16:15:22',
				      text: 'Ah scusa!',
				      status: 'received',
              isHideMenu: false
			      }
		      ],
	      },
	      {
		      name: 'Luisa',
		      avatar: 'img/luisa.png',
          active: false,
		      messages: [
			      {
				      date: '01/10/2020 15:30:55',
				      text: 'Lo sai che ha aperto una nuova pizzeria?',
				      status: 'sent',
              isHideMenu: false
			      },
			      {
				      date: '01/10/2020 15:50:00',
				      text: 'Si, ma preferirei andare al cinema',
				      status: 'received',
              isHideMenu: false
			      }
		      ],
	      },
      ]
    },
    computed: {
      actualIndex: function() {
        let actualIndex = 0;
        this.filterContacts.forEach((contact, index) => {
          if (contact.active == true) {
            actualIndex = index;
          }
        });
        return actualIndex
      },
      actualAvatar: {
        get: function() {
          let actualAvatar = "";
          actualAvatar = this.filterContacts[this.actualIndex].avatar;
          return actualAvatar;
        },
        set: function() {}
      },
      actualName: {
        get: function() {
          let actualName = "";
          actualName = this.filterContacts[this.actualIndex].name;
          return actualName
        },
        set: function() {}
      },

      actualDate: {
        get: function() {
          let actualDate = "";
          let convertedDate = "";
          let indexLastReceived = this.contacts[this.actualIndex].messages.map(item => item.status).lastIndexOf('received');
          if (indexLastReceived != -1) {
            if (new Date(this.lastSavedBefore).getTime() > new Date(this.contacts[this.actualIndex].messages[indexLastReceived].date).getTime()) {
              convertedDate = new Date(this.lastSavedBefore);
              actualDate = convertedDate.toLocaleString();
            } else {
              convertedDate = new Date(this.contacts[this.actualIndex].messages[indexLastReceived].date);
              actualDate = convertedDate.toLocaleString();
              this.lastSavedDate = actualDate;
            }
          } else {
            actualDate = this.lastSavedDate;
          }
          console.log(actualDate.substr(0,10))
          console.log(this.formattedDate().substr(0,10))
          return (actualDate.substr(0,10) == this.formattedDate().substr(0,10)) ? "oggi " + actualDate : "il " + actualDate
        },
        set: function() {}
      },
      filterContacts: function() {
        return this.contacts.filter((contact) => {
          return contact.name.toLowerCase().includes(this.search.trim());
        });
      },
      filteredMessages: function() {
        let activeChat;
        activeChat = this.filterContacts[this.actualIndex].messages;
        return activeChat;
      }
    },
    methods: {
      formattedDate: function() {
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = (date.getMinutes().toString().length == 1) ? "0" + date.getMinutes() : date.getMinutes();
        let seconds = (date.getSeconds().toString().length == 1) ? "0" + date.getSeconds() : date.getSeconds();
        return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`
      },
      changeActive: function(index) {
        if (this.noActives == false) {
          this.noActives = true;
        }
        this.filterContacts[this.actualIndex].active = false;
        this.filterContacts[index].active = true;
        this.actualName = this.filterContacts[index].name;
        this.actualAvatar = this.filterContacts[index].avatar;
        this.actualDate = this.filterContacts[index].messages[this.filterContacts[index].messages.length - 1].date;
      },
      send: function() {
        if (this.toSend == "") {
          return
        }
        let newMessage = new Object();
        newMessage.text = this.toSend;
        newMessage.status = 'sent';
        newMessage.isHideMenu = false;
        newMessage.date = this.formattedDate();
        this.filterContacts[this.actualIndex].messages.push(newMessage);
        this.toSend = "";
        this.scrollDown();
        this.isWriting = true;
        setTimeout(() => {
          let response = new Object();
          response.text = "Ok!";
          response.status = 'received';
          response.isHideMenu = false;
          response.date = this.formattedDate();
          this.filterContacts[this.actualIndex].messages.push(response);
          this.scrollDown();
          this.isWriting = false;
        }, 2000);
      },
      scrollDown: function() {
        // Aspetto che il DOM sia completamente caricato
        this.$nextTick(function () {
          // chiedere per manipolazione DOM?
          let myDiv = document.getElementById("chat_main");
          myDiv.scrollTop = myDiv.scrollHeight;
        })
      },
      showMenu: function(array, index) {
        array.forEach((message, newIndex) => {
          if (index != newIndex) {
            message.isHideMenu = false;
          }
        });
        array[index].isHideMenu = !array[index].isHideMenu;
      },
      hideAllMenu: function(array) {
        if(event.target.title != "message_menu") {
          array.forEach((message) => {
            message.isHideMenu = false;
          });
        }
      },
      deleteMess: function(array, index) {
        this.lastSavedBefore = array[array.map(item => item.status).lastIndexOf('received')].date;
        console.log(new Date(this.lastSavedBefore))
        this.$delete(array, index);
      }
    }
  }
);
