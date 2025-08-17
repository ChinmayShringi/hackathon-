// Auto-generated Lucide icon category map
// Imports all JSONs in this directory and builds iconToCategory and categoryOrder

import accessibility from './accessibility.json';
import account from './account.json';
import animals from './animals.json';
import arrows from './arrows.json';
import brands from './brands.json';
import buildings from './buildings.json';
import charts from './charts.json';
import communication from './communication.json';
import connectivity from './connectivity.json';
import cursors from './cursors.json';
import design from './design.json';
import development from './development.json';
import devices from './devices.json';
import emoji from './emoji.json';
import files from './files.json';
import finance from './finance.json';
import foodBeverage from './food-beverage.json';
import gaming from './gaming.json';
import home from './home.json';
import layout from './layout.json';
import mail from './mail.json';
import math from './math.json';
import medical from './medical.json';
import multimedia from './multimedia.json';
import nature from './nature.json';
import navigation from './navigation.json';
import notifications from './notifications.json';
import people from './people.json';
import photography from './photography.json';
import science from './science.json';
import seasons from './seasons.json';
import security from './security.json';
import shapes from './shapes.json';
import shopping from './shopping.json';
import social from './social.json';
import sports from './sports.json';
import sustainability from './sustainability.json';
import text from './text.json';
import time from './time.json';
import tools from './tools.json';
import transportation from './transportation.json';
import travel from './travel.json';
import weather from './weather.json';

const allCategories = {
  accessibility,
  account,
  animals,
  arrows,
  brands,
  buildings,
  charts,
  communication,
  connectivity,
  cursors,
  design,
  development,
  devices,
  emoji,
  files,
  finance,
  'food-beverage': foodBeverage,
  gaming,
  home,
  layout,
  mail,
  math,
  medical,
  multimedia,
  nature,
  navigation,
  notifications,
  people,
  photography,
  science,
  seasons,
  security,
  shapes,
  shopping,
  social,
  sports,
  sustainability,
  text,
  time,
  tools,
  transportation,
  travel,
  weather,
};

export const iconToCategory: Record<string, string> = {};

Object.entries(allCategories).forEach(([category, icons]) => {
  (icons as unknown as any[]).forEach((icon: string) => {
    iconToCategory[icon] = category;
  });
});

export const categoryOrder = Object.keys(allCategories); 