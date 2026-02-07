import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  locations = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Pune', 'Chennai'];

  categories = [
    {
      title: 'Live Concerts',
      description: 'From indie gigs to stadium tours, find your sound.',
    },
    {
      title: 'Stand-up Comedy',
      description: 'Laugh-out-loud nights with the best comics in town.',
    },
    {
      title: 'Theatre & Drama',
      description: 'Experience stories brought to life on stage.',
    },
    {
      title: 'Workshops',
      description: 'Learn, create, and meet people with shared interests.',
    },
  ];

  events = [
    {
      name: 'Sunset Indie Fest',
      venue: 'Phoenix Grounds, Mumbai',
      date: 'Sat, 12 Oct · 6:30 PM',
      price: 'From ₹799',
      tag: 'Music',
    },
    {
      name: 'Laugh Factory Live',
      venue: 'The Habitat, Bengaluru',
      date: 'Sun, 13 Oct · 8:00 PM',
      price: 'From ₹499',
      tag: 'Comedy',
    },
    {
      name: 'Broadway Nights',
      venue: 'NCPA, Mumbai',
      date: 'Fri, 18 Oct · 7:00 PM',
      price: 'From ₹999',
      tag: 'Theatre',
    },
    {
      name: 'Street Food Carnival',
      venue: 'DLF Avenue, Delhi',
      date: 'Sat, 19 Oct · 4:00 PM',
      price: 'Free Entry',
      tag: 'Festival',
    },
    {
      name: 'Tech Creators Meetup',
      venue: 'WeWork, Pune',
      date: 'Wed, 23 Oct · 6:00 PM',
      price: 'From ₹299',
      tag: 'Community',
    },
    {
      name: 'Morning Yoga Flow',
      venue: 'Cubbon Park, Bengaluru',
      date: 'Sun, 27 Oct · 7:00 AM',
      price: 'From ₹199',
      tag: 'Wellness',
    },
  ];

  highlights = [
    {
      title: 'Instant City Switch',
      description: 'Discover events by location in just a click.',
    },
    {
      title: 'Curated Picks',
      description: 'Handpicked experiences matched to your mood.',
    },
    {
      title: 'Easy Booking',
      description: 'Secure, fast checkout with digital tickets.',
    },
  ];
}
