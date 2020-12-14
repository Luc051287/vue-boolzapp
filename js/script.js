var app = new Vue(
  {
    el:"#root",
    data: {
      toSend: "",
      search: "",
      contacts: [
	{
		name: 'Michele',
		avatar: 'img/michele.png',
    // ATT a questa proprietà e ricordarsi di gestire la data
		visible: true,
    active: true,
		messages: [
			{
				date: '10/01/2020 15:30:55',
				text: 'Hai portato a spasso il cane?',
				status: 'sent'
			},
			{
				date: '10/01/2020 15:50:00',
				text: 'Ricordati di dargli da mangiare',
				status: 'sent'
			},
			{
				date: '10/01/2020 16:15:22',
				text: 'Tutto fatto!',
				status: 'received'
			}
		],
	},
	{
		name: 'Fabio',
		avatar: 'img/fabio.png',
		visible: true,
    active: false,
		messages: [
			{
				date: '20/03/2020 16:30:00',
				text: 'Ciao come stai?',
				status: 'sent'
			},
			{
				date: '20/03/2020 16:30:55',
				text: 'Bene grazie! Stasera ci vediamo?',
				status: 'received'
			},
			{
				date: '20/03/2020 16:35:00',
				text: 'Mi piacerebbe ma devo andare a fare la spesa.',
				status: 'sent'
			}
		],
	},
	{
		name: 'Samuele',
		avatar: 'img/samuele.png',
		visible: true,
    active: false,
		messages: [
			{
				date: '28/03/2020 10:10:40',
				text: 'La Marianna va in campagna',
				status: 'received'
			},
			{
				date: '28/03/2020 10:20:10',
				text: 'Sicuro di non aver sbagliato chat?',
				status: 'sent'
			},
			{
				date: '28/03/2020 16:15:22',
				text: 'Ah scusa!',
				status: 'received'
			}
		],
	},
	{
		name: 'Luisa',
		avatar: 'img/luisa.png',
		visible: true,
    active: false,
		messages: [
			{
				date: '10/01/2020 15:30:55',
				text: 'Lo sai che ha aperto una nuova pizzeria?',
				status: 'sent'
			},
			{
				date: '10/01/2020 15:50:00',
				text: 'Si, ma preferirei andare al cinema',
				status: 'received'
			}
		],
	},
]
    },
    // da rivedere il set
    computed: {
      formattedDate: function() {
        let date = new Date();
        return date.getDate() + "/" + (date.getMonth()+1)  + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
      },
      actualAvatar: {
        get: function() {
          let actualAvatar = "";
          this.contacts.forEach((contact, index) => {
            if (contact.active == true) {
              actualAvatar = contact.avatar;
            }
          });
          return actualAvatar;
        },
        set: function() {}
      },
      actualName: {
        get: function() {
          let actualName = "";
          this.contacts.forEach((contact, index) => {
            if (contact.active == true) {
              actualName = contact.name;
            }
          });
          return actualName
        },
        set: function() {}
      },

      actualDate: {
        get: function() {
          let actualDate = "";
          this.contacts.forEach((contact) => {
            let indexLastReceived = contact.messages.map(item => item.status).lastIndexOf('received');
            if (contact.active == true) {
              actualDate = contact.messages[indexLastReceived].date;
            }
          });
          return actualDate
        },
        set: function() {}
      }
    },
    methods: {
      changeActive: function(index) {
        let actualIndex = 0;
        this.contacts.forEach((contact, index) => {
          if (contact.active == true) {
            actualIndex = index;
          }
        });
        this.contacts[actualIndex].active = false;
        this.contacts[index].active = true;
        this.actualName = this.contacts[index].name;
        this.actualAvatar = this.contacts[index].avatar;
        this.actualDate = this.contacts[index].messages[this.contacts[index].messages.length - 1].date;
      },
      filteredMessages: function() {
        let activeChat;
        this.contacts.forEach((contact) => {
          if (contact.active == true) {
            activeChat = contact.messages;
          }
        });
        return activeChat;
      },
      filterContacts: function() {
        return this.contacts.filter((contact) => {
          return contact.name.toLowerCase().includes(this.search.trim());
        });
      },
      send: function() {
        let actualIndex = 0;
        this.contacts.forEach((contact, index) => {
          if (contact.active == true) {
            actualIndex = index;
          }
        });
        let newMessage = new Object();
        newMessage.text = this.toSend;
        newMessage.status = 'sent';
        newMessage.date = this.formattedDate;
        this.contacts[actualIndex].messages.push(newMessage);
        this.toSend = "";
        setTimeout(() => {
          let response = new Object();
          response.text = "Ok!";
          response.status = 'received';
          response.date = this.formattedDate;
          this.contacts[actualIndex].messages.push(response);
        }, 1000);
      }
    }
  }
)
