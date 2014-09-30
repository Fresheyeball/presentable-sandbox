module Todo.Presentables.Test where

import Test.Mocha
import Test.Chai
import Control.Monad.Eff

foreign import test "test" :: forall e. Eff e Unit