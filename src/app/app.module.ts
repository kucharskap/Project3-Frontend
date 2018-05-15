import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import 'rxjs/operator/toPromise';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { MainComponent } from './main/main.component';
import { UserService } from './services/user.service';

import { FlashcardComponent } from './flashcard/flashcard.component';
import { YourAccountComponent } from './your-account/your-account.component';
import { GroupsService } from './api/groups.service';
import { SubjectsService } from './api/subjects.service';
import { UsersGroupsComponent } from './users-groups/users-groups.component';
import { InputFilterPipe } from './pipes/input-filter.pipe';
import { StatsService } from './api/stats.service';
import { YourGroupsComponent } from './your-account/your-groups/your-groups.component';
import { YourSubjectsComponent } from './your-account/your-subjects/your-subjects.component';
import { UserAccountComponent } from './your-account/user-account/user-account.component';
import { CreateNewSubjectComponent } from './create-new-subject/create-new-subject.component';
import { UserPipePipe } from './pipes/user-pipe.pipe';
import { ChartsModule } from 'ng2-charts';
import { DonutChartComponent } from './donut-chart/donut-chart.component';





@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    MainComponent,
    FlashcardComponent,
    YourAccountComponent,
    UsersGroupsComponent,
    InputFilterPipe,
    YourGroupsComponent,
    YourSubjectsComponent,
    UserAccountComponent,
    CreateNewSubjectComponent,
    UserPipePipe,
    DonutChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule,
    FormsModule,
    ChartsModule
  ],
  providers: [GroupsService, SubjectsService, UserService, StatsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
