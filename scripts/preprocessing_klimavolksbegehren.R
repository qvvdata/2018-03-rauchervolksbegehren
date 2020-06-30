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

#source("scripts/BorderMan.R")

#####klimavolksbegehren
klimavolksbegehren <- read_excel("input/klimavolksbegehren_final.xlsx")%>%
  mutate(Wahlberechtigte=str_replace_all(Wahlberechtigte, '\\.', ''),
         Summe=str_replace_all(Summe, '\\.', ''),
         Unterstützungen=str_replace_all(Unterstützungen, '\\.', ''),
         Eintragungen=str_replace_all(Eintragungen, '\\.', '')
  ) %>% 
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
                                           if_else(type2!="0000" & type1 == 0, "bez","gem"))))) %>% 
  rename(GKZ=gkz) %>% 
  mutate(GKZ=as.character(GKZ))

#check der datenintegrität
#Bezirke aufgrund von Status Wiens als Bezirk und Gemeinde nicht übereinstimmend

klimavolksbegehren_check <- klimavolksbegehren%>%
  group_by(klasse)%>%
  summarise(sumwb = sum(Wahlberechtigte), 
            sumunt = sum(Unterstützungen),
            sumsum = sum(Summe))


nrw2019 <- read_xlsx("input/nrw2019.xlsx") %>% 
  rename(gültige=`...6`,
         ungültige=`...5`) %>% 
  numerize(vars=c("name", "GKZ"))

#%>%
#numerize(vars = c("name"))
#nrw2019 <- remove_teilungen(borderman(nrw2019))
nrw2019$GKZ <- sub('.', '', nrw2019$GKZ)

urbanrural <- read_excel("input/urbanrural_2019.xlsx", sheet = "DEGURBA 2019")%>%
  numerize(vars = c("name", "urbantyp", "urbanländlich")) %>% 
  mutate(GKZ=as.character(GKZ)) %>% 
  rename(rurb=CODE) %>% 
  select(GKZ, rurb)


contextdata <- nrw2019 %>% left_join(urbanrural, by=c("GKZ"))

