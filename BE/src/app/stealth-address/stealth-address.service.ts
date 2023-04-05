import { User } from '@schemas';

export class StealthServiceService {
  async submitPrivateKey(privateKey: string, address: string) {
    try {
      await User.findOneAndUpdate(
        {
          wallet_address: address,
        },
        {
          private_key: privateKey,
          wallet_address: address,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }
  async submitStealthAddress(wallet_address: string, address: string, from: string) {
    try {
      await User.findOneAndUpdate(
        {
          wallet_address,
        },
        {
          $addToSet: {
            stealth_address: {
              address,
              from,
            },
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async getPrivateKey(address: string) {
    try {
      const user = await User.findOne({
        wallet_address: address,
      });
      if (user)
        return {
          privateKey: user.private_key,
        };
      return {
        privateKey: '',
      };
    } catch (error) {
      return {
        privateKey: '',
      };
    }
  }
  async getListStealthAddress(address: string) {
    try {
      const user = await User.findOne({
        wallet_address: address,
      });
      if (user) return user.stealth_address;
      return [];
    } catch (error) {
      return [];
    }
  }
}
