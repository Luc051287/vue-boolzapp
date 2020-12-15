var app = new Vue(
  {
    el:"#root",
    data: {
      noActives: false,
      lastSavedDate: "",
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
				      date: '10/01/2020 15:30:55',
				      text: 'Hai portato a spasso il cane?',
				      status: 'sent',
              isHideMenu: false
			      },
			      {
				      date: '10/01/2020 15:50:00',
				      text: 'Ricordati di dargli da mangiare',
				      status: 'sent',
              isHideMenu: false
			      },
			      {
				      date: '10/01/2020 16:15:22',
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
				      date: '20/03/2020 16:30:00',
				      text: 'Ciao come stai?',
				      status: 'sent',
              isHideMenu: false
			      },
			      {
				      date: '20/03/2020 16:30:55',
				      text: 'Bene grazie! Stasera ci vediamo?',
				      status: 'received',
              isHideMenu: false
			      },
			      {
				      date: '20/03/2020 16:35:00',
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
				      date: '28/03/2020 10:10:40',
				      text: 'La Marianna va in campagna',
				      status: 'received',
              isHideMenu: false
			      },
			      {
				      date: '28/03/2020 10:20:10',
				      text: 'Sicuro di non aver sbagliato chat?',
				      status: 'sent',
              isHideMenu: false
			      },
			      {
				      date: '28/03/2020 16:15:22',
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
				      date: '10/01/2020 15:30:55',
				      text: 'Lo sai che ha aperto una nuova pizzeria?',
				      status: 'sent',
              isHideMenu: false
			      },
			      {
				      date: '10/01/2020 15:50:00',
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
          this.filterContacts.forEach((contact) => {
            let indexLastReceived = contact.messages.map(item => item.status).lastIndexOf('received');
            if (contact.active == true && indexLastReceived != -1) {
              actualDate = contact.messages[indexLastReceived].date;
              this.lastSavedDate = actualDate;
            } else {
              actualDate = this.lastSavedDate;
            }
          });
          return (actualDate == this.formattedDate()) ? "oggi " + actualDate : "il " + actualDate
        },
        set: function() {}
      },
      filterContacts: function() {
        return this.contacts.filter((contact) => {
          return contact.name.toLowerCase().includes(this.search.trim());
        });
      }
    },
    methods: {
      formattedDate: function() {
        let date = new Date();
        let minutes = (date.getMinutes().toString().length == 1) ? "0" + date.getMinutes() : date.getMinutes();
        let seconds = (date.getSeconds().toString().length == 1) ? "0" + date.getSeconds() : date.getSeconds();
        return date.getDate() + "/" + (date.getMonth()+1)  + "/" + date.getFullYear() + " " + date.getHours() + ":" + minutes + ":" + seconds
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
      filteredMessages: function() {
        let activeChat;
        activeChat = this.filterContacts[this.actualIndex].messages;
        return activeChat;
      },
      // filterContacts: function() {
      //   return this.contacts.filter((contact) => {
      //     return contact.name.toLowerCase().includes(this.search.trim());
      //   });
      // },
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
        // array.splice(index, 1);
        this.$delete(array, index);
      }
    }
  }
);
