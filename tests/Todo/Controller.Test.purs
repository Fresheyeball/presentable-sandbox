module Todo.Controller.Test where

import Todo.Controller 

import Test.Mocha
import Test.Chai

test = describe "true dat" $ do

  it "ithTrue" $ expect ithTrue `toEqual` true 


