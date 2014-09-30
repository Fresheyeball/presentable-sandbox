module Main where

import Control.Monad.Eff

main = do
  Todo.Controller.Test.test
  Todo.Presentables.Test.test