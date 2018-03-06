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


unterstuetzungen <- read_excel("input/unterstuetzungen.xlsx", 
                               col_types = c("text", "text", "numeric", 
                                "numeric", "numeric", "numeric", 
                               "numeric"))%>%
  numerize(vars = c("name"))

nrw2017 <- read_csv("input/nrw2017.csv")%>%
  numerize(vars = c("name"))%>%
  rename(wb_nrw = wb)
nrw2017 <- remove_teilungen(borderman(nrw2017))
nrw2017$gkz_neu <- as.numeric(nrw2017$gkz_neu)

urbanrural <- read_excel("input/urbanrural.xlsx", sheet="data")%>%
  numerize(vars = c("name", "urbantyp", "urbanländlich"))


data <- nrw2017 %>% left_join(urbanrural, by=c("gkz_neu"="gkz"))%>%
  rename(gkz = gkz_neu)


