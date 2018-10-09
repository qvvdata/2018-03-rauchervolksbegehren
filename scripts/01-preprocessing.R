#rm(list=ls())
library(tidyverse)
library(readxl)

numerize <- function(data,vars){
  data = as.data.frame(data)
  variables <- colnames(data)
  variables <- variables[! variables %in% vars]
  for(i in variables){
    data[,i]<- as.numeric(data[,i])
    data[,i][is.na(data[,i])] <- 0
  }
  return(data)
}

source("scripts/BorderMan.R")


# unterstuetzungen <- read_excel("input/unterstuetzungen.xlsx", 
#                                col_types = c("text", "text", "numeric", 
#                                 "numeric", "numeric", "numeric", 
#                                "numeric"))%>%
#   numerize(vars = c("name"))

rauchervolksbegehren <- read_excel("input/rauchervolksbegehren_2018-10-08.xlsx")%>%
  mutate(gkz = gsub('G', '', GKZ), 
         number = nchar(gkz))%>%
  subset(number ==5)%>%
  select(-GKZ)%>%
  mutate(type1 = substr(gkz, 4, 5), 
         type2= substr(gkz,2,5), 
         type3 = substr(gkz,4,5)) %>%
  numerize(vars = c("Name", "klasse", "type2", "typ3")) %>%
  mutate(klasse =  if_else(Name == "Österreich", "at",
                           if_else(gkz == 90001, "bl",
         if_else(type2 == "0000" & Name !="Österreich", "bl",
                 if_else(type2!="0000" & type1 == 0, "bez","gem")))))



#check der datenintegrität
#Bezirke aufgrund von Status Wiens als Bezirk und Gemeinde nicht übereinstimmend

rauchervolksbegehren_check <- rauchervolksbegehren%>%
  group_by(klasse)%>%
  summarise(sumwb = sum(Wahlberechtigte), 
            sumunt = sum(Unterstützungen),
            sumsum = sum(Summe))

#Daten des Frauenvolksbegehrens reinladen
fvb_8_3 <- read_excel("input/fvb_april.xlsx")%>%
  mutate(gkz = gsub('G', '', GKZ), 
         number = nchar(gkz))%>%
  subset(number ==5)%>%
  select(-GKZ)%>%
  mutate(type1 = substr(gkz, 4, 5), 
         type2= substr(gkz,2,5), 
         type3 = substr(gkz,4,5)) %>%
  numerize(vars = c("Name", "klasse", "type2", "typ3")) %>%
  mutate(klasse =  if_else(Name == "Österreich", "at",
                           if_else(gkz == 90001, "bl",
                                   if_else(type2 == "0000" & Name !="Österreich", "bl",
                                           if_else(type2!="0000" & type1 == 0, "bez","gem"))))) 


nrw2017 <- read_csv("input/nrw2017.csv")%>%
  numerize(vars = c("name"))%>%
  rename(wb_nrw = wb)
nrw2017 <- remove_teilungen(borderman(nrw2017))
nrw2017$gkz_neu <- as.numeric(nrw2017$gkz_neu)

urbanrural <- read_excel("input/urbanrural.xlsx", sheet="data")%>%
  numerize(vars = c("name", "urbantyp", "urbanländlich"))


contextdata <- nrw2017 %>% left_join(urbanrural, by=c("gkz_neu"="gkz"))%>%
  rename(gkz = gkz_neu)

#Volksbegehren von 1997 reinladen
fvb97 <- read_excel("input/volksbegehren97.xls") %>%
  numerize(vars = c("bezirk", "lh")) 

#Volksbegehren gegen ORF reinladen
orf <- read_excel("input/orf_2018-10-08.xlsx")%>%
  mutate(gkz = gsub('G', '', GKZ), 
         number = nchar(gkz))%>%
  subset(number ==5)%>%
  select(-GKZ)%>%
  mutate(type1 = substr(gkz, 4, 5), 
         type2= substr(gkz,2,5), 
         type3 = substr(gkz,4,5)) %>%
  numerize(vars = c("Name", "klasse", "type2", "typ3")) %>%
  mutate(klasse =  if_else(Name == "Österreich", "at",
                           if_else(gkz == 90001, "bl",
                                   if_else(type2 == "0000" & Name !="Österreich", "bl",
                                           if_else(type2!="0000" & type1 == 0, "bez","gem"))))) 


orf_check <- orf %>%
  group_by(klasse)%>%
  summarise(sumwb = sum(Wahlberechtigte), 
            sumunt = sum(Unterstützungen),
            sumsum = sum(Summe))
