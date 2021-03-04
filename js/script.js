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
				      date: '03/28/2020 10:10:40',
				      text: 'Sicuro di non aver sbagliato chat?',
				      status: 'sent',
              isHideMenu: false
			      },
			      {
				      date: '03/28/2020 10:10:40',
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
      actualAvatar: {
        get: function() {
          let actualAvatar = "";
          this.contacts.myFunction(function(elem) {
            actualAvatar = elem.avatar;
          })
          return actualAvatar;
        },
        set: function() {}
      },
      actualName: {
        get: function() {
          let actualName = "";
          this.contacts.myFunction(function(elem) {
            actualName = elem.name;
          })
          return actualName
        },
        set: function() {}
      },
      actualDate: {
        get: function() {
          let actualDate = "";
          this.contacts.myFunction((elem) => {
            let indexLastReceived = elem.messages.map(item => item.status).lastIndexOf('received');
            const lastDate = dayjs(this.lastSavedBefore);
            if (indexLastReceived != -1) {
              const newDate = dayjs(elem.messages[indexLastReceived].date);
              if (lastDate.isAfter(newDate)) {
                actualDate = lastDate.format('DD/MM/YYYY HH:mm:ss');
              } else {
                actualDate = newDate.format('DD/MM/YYYY HH:mm:ss');
                this.lastSavedDate = actualDate;
              }
            } else {
              actualDate = this.lastSavedDate;
            }
          })
          return (actualDate.substr(0,10) == this.dateEuFormat(this.formattedDate()).substr(0,10)) ? "oggi " + actualDate : "il " + actualDate
        },
        set: function() {}
      },
      filterContacts: function() {
        return this.contacts.filter((contact) => {
          return contact.name.toLowerCase().includes(this.search.trim().toLowerCase());
        });
      },
      filteredMessages: function() {
        let activeChat;
        this.contacts.myFunction(function(elem) {
          activeChat = elem.messages;
        })
        return activeChat;
      }
    },
    methods: {
      dateEuFormat: function(date) {
        let dateNew = dayjs(date);
        return dateNew.format('DD/MM/YYYY HH:mm:ss')
      },
      formattedDate: function() {
        const date = dayjs();
        return date.format('MM/DD/YYYY HH:mm:ss')
      },
      changeActive: function(index) {
        if (this.noActives == false) {
          this.noActives = true;
        }
        this.contacts.forEach((elem) => {
          if (elem.active == true) {
            elem.active = false;
          }
        })
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
        this.contacts.myFunction(function(elem) {
          elem.messages.push(newMessage);
        })
        this.toSend = "";
        this.scrollDown();
        this.isWriting = true;
        setTimeout(() => {
          let response = new Object();
          response.text = "Ok!";
          response.status = 'received';
          response.isHideMenu = false;
          response.date = this.formattedDate();
          this.contacts.myFunction(function(elem) {
            elem.messages.push(response);
          })
          this.scrollDown();
          this.isWriting = false;
        }, 2000);
      },
      scrollDown: function() {
        // Aspetto che il DOM sia completamente caricato. Si poteva anche usare setTimeout, cosi lui mette in coda l'aggiornamento
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
        if (!array) {
          return
        }
        if(event.target.title != "message_menu") {
          array.forEach((message) => {
            message.isHideMenu = false;
          });
        }
      },
      deleteMess: function(array, index) {
        if (array.map(item => item.status).lastIndexOf('received') != -1) {
          this.lastSavedBefore = array[array.map(item => item.status).lastIndexOf('received')].date;
        }
        this.$delete(array, index);
      }
    }
  }
);

Array.prototype.myFunction = function(callback) {
  this.forEach((elem) => {
    if (elem.active == true) {
      callback(elem);
    }
  })
}
