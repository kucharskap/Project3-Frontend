// When you go to a webpage
import { Component, OnInit } from '@angular/core';
import { GroupsService, Group } from '../api/groups.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, SubjectsService, Card } from '../api/subjects.service';
import { Stat, StatsService } from '../api/stats.service';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.css'],
})
export class FlashcardComponent implements OnInit {
  // properties (aka fields) of the class
  subjectId: string;
  subject: Subject;
  groupId: string;
  stats: Stat[];

  currentCardRating: number;
  currentCardColor: string;


  currentCardId: number = -1;
  currentCard: Card;
  classState: any = {
    showForm: true,
  };
  individualStats: any;

  oneHundredPercent: boolean = false;

  constructor(
    private reqTruc: ActivatedRoute, // where am I on the website + context (parameters)
    public apiGroup: GroupsService,
    public apiStats: StatsService,
    public apiSubject: SubjectsService,
    private resTruc: Router
  ) { }


  ngOnInit() { // when you load the page
    this.reqTruc.paramMap
      .subscribe((myParams) => {
        this.subjectId = myParams.get('subjectId');
        this.groupId = myParams.get('groupId');
        this.getIndividualStats();
        this.getCardsList()
          .then((subject: Subject) => this.getNextCard());
          

      })
    console.log(this.apiGroup.currentGroup)
  }


  getCardsList() {
    return this.apiSubject.getSubDetails(this.subjectId)
      .then((result: Subject) => {
        this.subject = result;
        return this.subject;
      })
      .catch((err) => {
        console.log('Subject details error')
        console.log(err)
      })
  }

  getStatsList() {
    return this.apiStats.getAllStatsForUser(this.groupId, this.subjectId)
      .then((result: Stat[]) => {
        this.stats = result;
        return this.stats;
      })
      .catch((err) => {
        console.log('Stats details error')
        console.log(err)
      })
  }


  getAverageComplete(){
    return this.individualStats.percentageComplete; 
  }

  getDistributionForDonut(){
    var distributionForDonut = [];
    var sumOfCardRatings = this.individualStats.cardRatingsDistribution['1']
    + this.individualStats.cardRatingsDistribution['2']
    + this.individualStats.cardRatingsDistribution['3']
    + this.individualStats.cardRatingsDistribution['4']
    + this.individualStats.cardRatingsDistribution['5']

    var arrayOfRatings = [this.individualStats.cardRatingsDistribution['1'], 
    this.individualStats.cardRatingsDistribution['2'],
    this.individualStats.cardRatingsDistribution['3'],
    this.individualStats.cardRatingsDistribution['4'],
    this.individualStats.cardRatingsDistribution['5']
  ]
    arrayOfRatings.forEach((one) => {
      var percentage = (one / sumOfCardRatings) * 100
      distributionForDonut.push(percentage)
    }); 
    return distributionForDonut;
  }

  getNextCard() {
    this.flipBackVisibility();
    

    this.getStatsList()
      .then((stats: Stat[]) => {
        var ratedStats = stats.filter((stat) => {
          return stat.rating !== 0;
        });

        // The filter() method creates a new array with all elements that pass the test implemented by the provided function
        // create an array that only contains cards that are not rated (not in ratedStats array)
        var unseenCards = this.subject.cards.filter((card: Card) => {
          
          // if (card === null) {
          for (var i = 0; i < ratedStats.length; i++) {
              if (card._id == ratedStats[i].card) {
                return false
              }
          }
          return true
        });

        // TODO
        // generate a random number between 0 and 1 (var num= Math.random();)
        var chooseNewCard = (ratedStats.length <= 0) || ((unseenCards.length > 0) && (Math.random() < 0.9))

        // set probabilty of getting new card (set whatever you want)
        if (chooseNewCard) {  // for instance, 70% of the time
          this.currentCard = unseenCards[0];
          this.currentCardColor = null;
          this.currentCardRating = null;
        } else {
          

          // show the cards by rank
          var choices = [];
          ratedStats.forEach((stat) => {
            const numberOfAppearances = 6 - stat.rating
            for (var i = 0; i < numberOfAppearances; i++) {
              choices.push(stat)
            }
          })
          var randomCardIndex = Math.floor(Math.random() * choices.length)
          // while the card is the same, pick a new one (garuntees new card)
          console.log(this.currentCard)
          console.log(choices[randomCardIndex].card)
          if (this.currentCard) { // before we assign the first card, currentCard is always null
            while (this.currentCard._id === choices[randomCardIndex].card) {
              randomCardIndex = Math.floor(Math.random() * choices.length)
            }
          }
          
          // this.currentCard = choices[randomCardIndex];

          this.currentCard = this.subject.cards.find((card) => {
            if (card._id === choices[randomCardIndex].card) {
              this.currentCardRating = choices[randomCardIndex].rating;
              this.currentCardColor = `bottom-color${this.currentCardRating}`
              console.log("Changed color:" + this.currentCardColor)
              return true
            }
            return false
          });
          // this.currentCardId = (this.currentCardId + 1) % this.subject.cards.length;
          // this.currentCard = this.subject.cards[this.currentCardId]

          console.log(this.currentCard);
        }
      })
  }

  getIndividualStats() {
    var promiseCards = this.getCardsList()
    var promiseStats = this.getStatsList()
    Promise.all([promiseStats, promiseCards])
      .then((result: any) => {
        const ratedStats = result[0];
        const subjectCards = result[1].cards;

        //get basic stats
        var numberOfCards = subjectCards.length

    
        var sumOfRatings = ratedStats.reduce(function (a, b) {
          return a + b.rating;
        }, 0);
        var averageRating = (sumOfRatings / numberOfCards)

        console.log(ratedStats)
        console.log(numberOfCards)

        var percentageComplete = Math.floor(averageRating / 5 * 100)
        console.log(percentageComplete)
        
        if(percentageComplete === 100){
          this.oneHundredPercent = true;
        } else {
          this.oneHundredPercent = false;
        }
      

        var cardsViewed = ratedStats.length

        //get card distribution and number of cards mastered (rating of 5)
        var cardRatingsDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratedStats.forEach((stat) => {
          cardRatingsDistribution[stat.rating]++
        })

        var numberCardsMastered = cardRatingsDistribution[5];

        // get best and worst cards

        var maxRating = ratedStats.reduce(function(a: number, b: Stat) {
          return Math.max(a, b.rating);
        }, 0);
        
        var bestStat; //card with highest rating and minimum number of views
        ratedStats.forEach((stat: Stat) => {
          if (stat.rating === maxRating){
            if (bestStat === undefined || (stat.seen < bestStat.seen)){
              bestStat = stat;
            }
          }
        })

        var bestCard = subjectCards.find((card) => {
          return bestStat.card === card._id
        })
        

        var minRating = ratedStats.reduce(function(a: number, b: Stat) {
          return Math.min(a, b.rating);
        }, 5);
        
        var worstStat; //card with lowest rating and maximum number of views
        ratedStats.forEach((stat: Stat) => {
          if (stat.rating === minRating){
            if (worstStat === undefined || (stat.seen > worstStat.seen)){
              worstStat = stat;
            }
          }
        })

        var worstCard = subjectCards.find((card) => {
          return worstStat.card === card._id
        })

        this.individualStats = {
          numberOfCards, 
          sumOfRatings, 
          averageRating, 
          percentageComplete,  
          cardsViewed, 
          cardRatingsDistribution, 
          numberCardsMastered,
          bestCard, 
          worstCard
        }
        console.log("IndividualStats recalculated:" + JSON.stringify(this.individualStats))
      })
      .catch((err) => { 
        console.log("individual stats error")
        console.log(err)
      })
  };

  flipBackVisibility() {
    this.classState.showForm = !this.classState.showForm;
  }

  rateCardandUpdate(rating: number) {
    
    //To guarantee we don't write a null card to the stats table
    if (!this.currentCard) {
      return
    }


    let ids = {
      card: this.currentCard,
      group: this.groupId,
      subject: this.subjectId,
      rating: rating
    }

    this.apiStats.getStatsList(ids)
      .then((result: Stat[]) => {
        console.log(result);
        this.stats = result;
        this.getIndividualStats();
        this.getNextCard();
      })
      .catch((err) => {
        console.log('error rate card and update');
        console.log(err)
      })

  }
}



