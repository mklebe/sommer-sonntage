const rockList: Array<string> = [
  "Black Sabbath - Paranoid",
  "Motörhead - Ace Of Spades",
  "Led Zeppelin - Kashmir",
  "Metallica - Enter Sandman",
  "AC/DC - Highway To Hell",
  "System Of A Down - Chop Suey!",
  "Metallica - Master Of Puppets",
  "Guns N' Roses - Welcome To The Jungle",
  "Slayer - Raining Blood",
  "Rage Against The Machine - Killing In The Name",
  "Iron Maiden - The Number Of The Beast",
  "Guns N' Roses - Paradise City",
  "The Beatles - Helter Skelter",
  "AC/DC - Thunderstruck",
  "Black Sabbath - War Pigs",
  "AC/DC - Let There Be Rock",
  "Deep Purple - Smoke On The Water",
  "Led Zeppelin - Whole Lotta Love",
  "Deep Purple - Child In Time",
  "AC/DC - T.N.T.",
  "Foo Fighters - The Pretender",
  "AC/DC - Back In Black",
  "The Runaways - Cherry Bomb",
  "MC5 - Kick Out The Jams",
  "Helmet - Unsung",
  ];
  
  describe('Place tips for current sommer sonntag', () => {
    it('registers for the placing tips', () => {
      cy.visit('http://localhost:3000');
      cy.get('input[placeholder="Benutzername"]')
        .type("Matze")
      
      cy.contains('Anmelden')
        .click();
  
      cy.contains("Willkommen Matze");
      cy.contains("Tipps abgeben").click();
      cy.contains('ROCK HARD - Die 100 besten Hard Rock und Heavy Metal Songs');
  
      rockList.forEach(async (tip, index) => {
        cy.get('input').eq(index).type(tip)
      })
  
      cy.contains('Tipps abschicken').click();
      cy.contains('Vielen Dank! Wir haben deine Tipps erhalten!')
    })
  });
  
  export {};
  